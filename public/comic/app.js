import { COMIC, GLOSSARY } from "./data.js";

// Flatten chapters into a single ordered list of panels, each remembering
// which chapter it belongs to.
function flattenPanels(comic) {
  const flat = [];
  comic.chapters.forEach((chapter, chapterIndex) => {
    chapter.panels.forEach((panel, panelIndex) => {
      flat.push({ ...panel, chapterIndex, panelIndex, chapter });
    });
  });
  return flat;
}

const els = {};

function cacheEls() {
  [
    "loading", "comic", "errorCard=error-card", "errorMessage=error-message",
    "chapterEyebrow=chapter-eyebrow", "chapterTitle=chapter-title", "panelCount=panel-count",
    "panelHeading=panel-heading", "artBox=art-box", "bubbleLayer=bubble-layer",
    "hotspotLayer=hotspot-layer", "moreLayer=more-layer", "narrationText=narration-text",
    "transcript", "audioStatus=audio-status", "previousButton=previous-button",
    "moreButton=more-button", "nextButton=next-button", "pipMeter=pip-meter",
    "pipCount=pip-count", "audioToggle=audio-toggle",
    "glossaryBackdrop=glossary-backdrop", "glossaryCard=glossary-card",
    "glossaryClose=glossary-close", "glossaryTitle=glossary-title",
    "glossaryShort=glossary-short", "glossaryLong=glossary-long", "glossaryMore=glossary-more",
  ].forEach((entry) => {
    const [key, id] = entry.includes("=") ? entry.split("=") : [entry, entry];
    els[key] = document.getElementById(id);
  });
}

const state = {
  panels: [],
  index: 0,
  moreOpen: false,
  glossaryOpen: false,
  glossaryMoreOpen: false,
  speaking: false,
  lastFocusedHotspot: null,
};

function init() {
  cacheEls();
  try {
    state.panels = flattenPanels(COMIC);
    if (!state.panels.length) throw new Error("The comic has no panels.");
    wireControls();
    render();
    els.loading.hidden = true;
    els.comic.hidden = false;
    if ("speechSynthesis" in window) {
      els.audioToggle.hidden = false;
    }
  } catch (err) {
    showError(err);
  }
}

function showError(err) {
  els.loading.hidden = true;
  els.comic.hidden = true;
  els.errorCard.hidden = false;
  els.errorMessage.textContent = err && err.message
    ? err.message
    : "The comic could not be loaded.";
  // eslint-disable-next-line no-console
  console.error(err);
}

function wireControls() {
  els.previousButton.addEventListener("click", () => go(state.index - 1));
  els.nextButton.addEventListener("click", () => go(state.index + 1));
  els.moreButton.addEventListener("click", toggleMore);

  document.addEventListener("keydown", (event) => {
    if (state.glossaryOpen) {
      if (event.key === "Escape") closeGlossary();
      return;
    }
    if (event.key === "ArrowRight") go(state.index + 1);
    if (event.key === "ArrowLeft") go(state.index - 1);
  });

  // Swipe support
  let touchStartX = null;
  els.artBox.parentElement.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  els.artBox.parentElement.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) go(state.index + (dx < 0 ? 1 : -1));
    touchStartX = null;
  });

  els.glossaryClose.addEventListener("click", closeGlossary);
  els.glossaryBackdrop.addEventListener("click", closeGlossary);
  els.glossaryMore.addEventListener("click", toggleGlossaryMore);

  if ("speechSynthesis" in window) {
    els.audioToggle.addEventListener("click", toggleAudio);
  }
}

function go(nextIndex) {
  if (nextIndex < 0 || nextIndex >= state.panels.length) return;
  stopAudio();
  state.index = nextIndex;
  state.moreOpen = false;
  render();
}

function currentPanel() {
  return state.panels[state.index];
}

function render() {
  const panel = currentPanel();
  const { chapter } = panel;

  els.chapterEyebrow.textContent = chapter.eyebrow;
  els.chapterTitle.textContent = chapter.title;
  els.panelCount.textContent = `Panel ${panel.panelIndex + 1} of ${chapter.panels.length}`;
  els.panelHeading.textContent = panel.heading;

  els.artBox.innerHTML = panel.art;

  els.bubbleLayer.innerHTML = "";
  if (panel.pip) {
    const bubble = document.createElement("div");
    bubble.className = "speech-bubble";
    bubble.innerHTML = `<span class="speaker">Joey says</span>${escapeHtml(panel.pip)}`;
    els.bubbleLayer.appendChild(bubble);
  }

  els.hotspotLayer.innerHTML = "";
  if (panel.hotspot && GLOSSARY[panel.hotspot.term]) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hotspot-button";
    btn.innerHTML = `<span class="hotspot-dot" aria-hidden="true"></span> Touch the tech: ${escapeHtml(panel.hotspot.label)}`;
    btn.addEventListener("click", () => openGlossary(panel.hotspot.term, btn));
    els.hotspotLayer.appendChild(btn);
  }

  els.narrationText.hidden = !panel.narration;
  els.narrationText.textContent = panel.narration || "";

  els.transcript.innerHTML = "";

  renderMore(panel);

  els.previousButton.disabled = state.index === 0;
  els.nextButton.disabled = state.index === state.panels.length - 1;
  els.nextButton.innerHTML = state.index === state.panels.length - 1
    ? `Full time <span aria-hidden="true">🏁</span>`
    : `Next <span aria-hidden="true">→</span>`;

  const progress = state.panels.length > 1
    ? Math.round((state.index / (state.panels.length - 1)) * 100)
    : 100;
  els.pipMeter.style.setProperty("--progress", `${progress}%`);
  els.pipCount.textContent = `${state.index + 1} / ${state.panels.length}`;

  els.audioStatus.textContent = "";
}

function renderMore(panel) {
  els.moreButton.setAttribute("aria-pressed", String(state.moreOpen));
  els.moreLayer.hidden = !state.moreOpen;
  if (state.moreOpen && panel.more) {
    els.moreLayer.innerHTML = `<h3>${escapeHtml(panel.more.title)}</h3><p>${escapeHtml(panel.more.body)}</p>`;
  } else {
    els.moreLayer.innerHTML = "";
  }
}

function toggleMore() {
  state.moreOpen = !state.moreOpen;
  renderMore(currentPanel());
}

function openGlossary(term, triggerEl) {
  const entry = GLOSSARY[term];
  if (!entry) return;
  state.glossaryOpen = true;
  state.glossaryMoreOpen = false;
  state.lastFocusedHotspot = triggerEl || null;

  els.glossaryTitle.textContent = entry.term;
  els.glossaryShort.textContent = entry.short;
  els.glossaryLong.textContent = entry.long;
  els.glossaryLong.hidden = true;
  els.glossaryMore.setAttribute("aria-expanded", "false");
  els.glossaryMore.textContent = "Tell me more";

  els.glossaryBackdrop.hidden = false;
  els.glossaryCard.hidden = false;
  els.glossaryClose.focus();
}

function closeGlossary() {
  state.glossaryOpen = false;
  els.glossaryBackdrop.hidden = true;
  els.glossaryCard.hidden = true;
  if (state.lastFocusedHotspot) {
    state.lastFocusedHotspot.focus();
    state.lastFocusedHotspot = null;
  }
}

function toggleGlossaryMore() {
  state.glossaryMoreOpen = !state.glossaryMoreOpen;
  els.glossaryLong.hidden = !state.glossaryMoreOpen;
  els.glossaryMore.setAttribute("aria-expanded", String(state.glossaryMoreOpen));
  els.glossaryMore.textContent = state.glossaryMoreOpen ? "Show less" : "Tell me more";
}

function toggleAudio() {
  if (state.speaking) {
    stopAudio();
    return;
  }
  const panel = currentPanel();
  const lines = [panel.narration, panel.pip].filter(Boolean);
  if (!lines.length) return;

  window.speechSynthesis.cancel();
  const utterances = lines.map((line) => new SpeechSynthesisUtterance(line));
  utterances.forEach((utterance, i) => {
    utterance.rate = 1;
    utterance.onend = () => {
      if (i === utterances.length - 1) stopAudio();
    };
  });

  state.speaking = true;
  els.audioToggle.setAttribute("aria-pressed", "true");
  els.audioToggle.querySelector(".audio-label").textContent = "Stop";
  els.audioToggle.querySelector("span[aria-hidden]").textContent = "■";
  els.audioStatus.textContent = "Reading this panel aloud…";

  utterances.forEach((u) => window.speechSynthesis.speak(u));
}

function stopAudio() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  state.speaking = false;
  if (els.audioToggle) {
    els.audioToggle.setAttribute("aria-pressed", "false");
    const label = els.audioToggle.querySelector(".audio-label");
    const icon = els.audioToggle.querySelector("span[aria-hidden]");
    if (label) label.textContent = "Read aloud";
    if (icon) icon.textContent = "▶";
  }
  if (els.audioStatus) els.audioStatus.textContent = "";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
