// NA SIGNALA — comic data
// Every panel: art (inline SVG), narration, one Joey line, and an optional
// hotspot linking to a glossary term. Chapters map the real path a
// broadcast takes: pitch → truck → the last mile to your screen.

const dot = (cx, cy, r, cls) => `<circle cx="${cx}" cy="${cy}" r="${r}" class="${cls}"/>`;

function halftone(originX, originY, cols, rows, gap, r) {
  let out = "";
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      out += dot(originX + i * gap, originY + j * gap, r, "ht");
    }
  }
  return out;
}

export const GLOSSARY = {
  camera: {
    term: "Broadcast camera",
    short: "A stadium camera doesn't just film — it turns light into an electrical signal, live, 50 times a second.",
    long: "A single match uses 30–40 of these, each one a small factory: a lens focuses light onto a sensor, the sensor turns it into a stream of electrical pulses, and a tiny onboard computer stamps every frame with the exact time. That timestamp matters later — it's how the truck lines up dozens of feeds without them drifting apart.",
  },
  obvan: {
    term: "OB van",
    short: "The \"outside broadcast\" truck is a full TV studio on wheels, parked just outside the stadium.",
    long: "Everything that would normally live in a building — the vision mixer, the audio desk, the graphics computers, the replay operators — is squeezed into a trailer. Thick cable runs called \"snakes\" carry every camera and microphone signal into it, sometimes over a kilometre of cable in total.",
  },
  switcher: {
    term: "Vision switcher",
    short: "The switcher is the big panel of buttons a director uses to cut between camera feeds instantly.",
    long: "All 30-odd camera feeds arrive at the switcher at once, playing in real time on a wall of small monitors. When the director calls \"cut to camera 4,\" the technical director presses one button and the switcher swaps the output feed in a single frame — no visible seam, even though the two cameras are on opposite sides of the pitch.",
  },
  encoder: {
    term: "Encoder",
    short: "Raw video is huge. The encoder squeezes it down to a fraction of its size without losing much you'd notice.",
    long: "Uncompressed HD video runs to well over a gigabit per second — far too big to send anywhere useful. The encoder throws away detail a human eye barely registers (like tiny variations inside a patch of grass) and describes each frame mostly as the *difference* from the last one. The result: the same picture, at a fraction of the size.",
  },
  uplink: {
    term: "Uplink",
    short: "The compressed signal leaves the truck through a satellite dish or a dedicated fibre line.",
    long: "Big events usually send the signal two ways at once, for redundancy: up to a satellite in geostationary orbit, and down a leased fibre line to a broadcast centre. If one path fails mid-match, the other keeps the picture on air without viewers ever knowing.",
  },
  satellite: {
    term: "Satellite hop",
    short: "The dish points at a satellite roughly 36,000 km up, which repeats the signal back down to the other side of the planet.",
    long: "That round trip is why some viewers notice their neighbour's cheer half a second before their own TV shows the goal — light is fast, but 36,000 km up and 36,000 km back down still takes a measurable moment. Engineers call this satellite delay, and it's added on top of every other step in the chain.",
  },
  headend: {
    term: "Broadcast centre",
    short: "A hub that receives the raw feed and re-packages it for every kind of viewer at once.",
    long: "One incoming signal leaves this building in dozens of forms: a version for cable operators, a version for satellite TV, and several versions for the internet, each at a different resolution so a phone on a weak signal and a home cinema on fibre can both keep up.",
  },
  cdn: {
    term: "CDN (content delivery network)",
    short: "A worldwide network of servers that stores copies of the stream close to where viewers actually are.",
    long: "Instead of every viewer's device connecting all the way back to one broadcast centre, they connect to a nearby server that already has the stream — often in the same city. Spreading the load this way is the only reason millions of people can watch the same moment at once without the system falling over.",
  },
  decoder: {
    term: "Decoder",
    short: "The chip in your TV, set-top box, or phone that reverses the encoder's work, frame by frame.",
    long: "It reads the compact instructions the encoder wrote — \"this frame is like the last one, except…\" — and rebuilds full pictures fast enough to display 50 or 60 times a second. A short buffer of frames is held in memory first, a small safety margin in case the next chunk of data arrives a beat late.",
  },
};

export const COMIC = {
  title: "NA SIGNALA",
  chapters: [
    {
      eyebrow: "CHAPTER 1 · AT THE STADIUM",
      title: "Kickoff",
      panels: [
        {
          heading: "Forty eyes on the pitch",
          narration:
            "Kickoff, in a stadium built for ninety thousand. Around the pitch, thirty-odd cameras are already rolling — wide shots, tight shots, one hanging from a wire above the centre circle.",
          pip: "Hi — I'm Joey! Tonight I'm one tiny packet of picture, about to cross half the planet before the final whistle.",
          hotspot: { term: "camera", label: "a camera" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A stadium bowl full of floodlights and fans, with a camera on a raised platform overlooking the pitch">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <path d="M0 210 Q240 130 480 210 L480 300 L0 300 Z" class="art-pitch"/>
            <path d="M0 210 Q240 130 480 210" class="art-pitch-line"/>
            <g class="art-crowd">${halftone(20, 40, 22, 4, 20, 3.2)}</g>
            <rect x="30" y="0" width="14" height="70" class="art-tower"/>
            <rect x="436" y="0" width="14" height="70" class="art-tower"/>
            <g class="art-flood"><circle cx="37" cy="14" r="12"/><circle cx="443" cy="14" r="12"/></g>
            <g class="art-cam-rig">
              <rect x="196" y="150" width="18" height="46" class="art-tower"/>
              <rect x="176" y="140" width="58" height="20" rx="3" class="art-camera"/>
              <circle cx="230" cy="150" r="9" class="art-lens"/>
              <circle cx="230" cy="150" r="4" class="art-lens-in"/>
            </g>
            <circle cx="120" cy="230" r="6" class="art-ball"/>
          </svg>`,
          more: {
            title: "Why so many cameras?",
            body: "No single camera can be everywhere. Editors keep every feed live at once so the director can cut to whichever angle tells the moment best — the goal, the reaction, the replay, all captured in parallel from the first whistle.",
          },
        },
        {
          heading: "Sound, sensors, and the referee's mic",
          narration:
            "Video is only half the story. Pitch-side microphones pick up the crack of the ball, the roar of the crowd, and a tiny mic clipped to the referee — each one its own stream, timestamped to the same clock as the cameras.",
          pip: "Every camera, every mic, gets the exact same timestamp. Lose that, and the crowd noise arrives half a second before the goal that caused it.",
          hotspot: { term: "camera", label: "the timestamp" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A referee wearing a microphone, with sound waves and a pitch-side microphone stand nearby">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <path d="M0 220 Q240 160 480 220 L480 300 L0 300 Z" class="art-pitch"/>
            <g class="art-ref">
              <circle cx="200" cy="120" r="22" class="art-head"/>
              <rect x="178" y="142" width="44" height="70" rx="10" class="art-body"/>
              <rect x="192" y="108" width="10" height="8" rx="2" class="art-mic-clip"/>
            </g>
            <g class="art-waves">
              <path d="M240 130 q10 -14 20 0" class="art-wave"/>
              <path d="M240 130 q16 -22 32 0" class="art-wave"/>
              <path d="M240 130 q22 -30 44 0" class="art-wave"/>
            </g>
            <g class="art-mic-stand">
              <rect x="330" y="200" width="6" height="60" class="art-tower"/>
              <circle cx="333" cy="192" r="14" class="art-mic-head"/>
              <g class="art-mic-mesh">${halftone(322, 182, 4, 4, 6, 1.4)}</g>
            </g>
          </svg>`,
          more: {
            title: "Genlock: the invisible metronome",
            body: "Every camera and mic in the truck is locked to a single shared clock signal, called \"genlock.\" It's why switching from camera to camera never causes a stutter — every device in the chain is, quite literally, ticking in perfect unison.",
          },
        },
        {
          heading: "Out through the snake",
          narration:
            "Every feed leaves the stadium the same way: down thick cable bundles nicknamed \"snakes,\" out to a row of trucks parked in the car park behind the stands.",
          pip: "This is where I stop being light and sound — and become data.",
          hotspot: { term: "obvan", label: "the OB van" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="Thick cables running from a stadium wall into a parked outside broadcast truck">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <rect x="0" y="0" width="480" height="120" class="art-wall"/>
            <path d="M40 120 C 90 170, 150 150, 210 200" class="art-cable"/>
            <path d="M60 120 C 110 180, 170 160, 230 210" class="art-cable"/>
            <path d="M80 120 C 130 190, 190 170, 250 220" class="art-cable"/>
            <g class="art-truck">
              <rect x="250" y="150" width="180" height="90" rx="6" class="art-truck-body"/>
              <rect x="264" y="164" width="60" height="34" rx="3" class="art-truck-window"/>
              <circle cx="290" cy="248" r="14" class="art-wheel"/>
              <circle cx="400" cy="248" r="14" class="art-wheel"/>
              <rect x="330" y="120" width="6" height="34" class="art-antenna"/>
              <circle cx="333" cy="116" r="6" class="art-antenna-tip"/>
            </g>
          </svg>`,
          more: {
            title: "How much cable, really?",
            body: "For a major match, the total cable run inside and around the stadium can add up to several kilometres — camera cable, mic cable, intercom for the crew, and power, all bundled and routed months before a ball is kicked.",
          },
        },
      ],
    },
    {
      eyebrow: "CHAPTER 2 · THE BROADCAST TRUCK",
      title: "Inside the truck",
      panels: [
        {
          heading: "Thirty screens, one decision",
          narration:
            "Inside, a wall of small monitors plays every camera feed live. The director watches all of them and calls the cuts; the technical director's hand is already on the button before the word is finished.",
          pip: "\"Cut to camera four\" takes less time to happen than to say.",
          hotspot: { term: "switcher", label: "the switcher" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A wall of small monitors inside a broadcast truck, with a technical director at a switcher panel">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <g class="art-monitor-wall">
              ${[0,1,2,3,4,5].map((i)=>`<rect x="${30 + (i%3)*90}" y="${30 + Math.floor(i/3)*70}" width="72" height="52" rx="3" class="art-monitor"/>`).join("")}
              <rect x="30" y="30" width="72" height="52" rx="3" class="art-monitor art-monitor-on"/>
            </g>
            <rect x="60" y="200" width="300" height="50" rx="4" class="art-desk"/>
            <g class="art-buttons">${halftone(80, 214, 12, 2, 22, 4)}</g>
            <circle cx="215" cy="255" r="18" class="art-head"/>
            <rect x="197" y="270" width="36" height="30" rx="8" class="art-body"/>
          </svg>`,
          more: {
            title: "Why a human, not software?",
            body: "Software can switch signals instantly, but choosing *which* angle tells the story is still a judgement call made in real time — the director is reading the whole game, not just the ball, to decide what's worth showing next.",
          },
        },
        {
          heading: "Squeezing a giant signal small",
          narration:
            "The chosen feed is enormous — over a gigabit of data every second, uncompressed. Before it can go anywhere, an encoder has to make it small enough to actually send.",
          pip: "I get flattened, compared to my last frame, and rewritten as mostly just 'what changed.' It's a diet, not a demolition.",
          hotspot: { term: "encoder", label: "the encoder" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A large square of video being compressed by an encoder into a much smaller square">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <rect x="40" y="60" width="160" height="160" rx="6" class="art-frame-big"/>
            <g class="art-frame-grid">${halftone(56, 76, 8, 8, 18, 2)}</g>
            <path d="M215 140 L 300 140" class="art-arrow-line"/>
            <path d="M290 128 L 306 140 L 290 152 Z" class="art-arrow-head"/>
            <rect x="330" y="120" width="46" height="46" rx="4" class="art-frame-small"/>
            <text x="353" y="200" text-anchor="middle" class="art-label">~1/50th</text>
          </svg>`,
          more: {
            title: "Lossy, on purpose",
            body: "This is called \"lossy\" compression — some information really is discarded, permanently. The trick is choosing what to discard: fine texture in blurred grass, yes; the sharp edge of a ball crossing a goal line, no.",
          },
        },
        {
          heading: "Two ways out, just in case",
          narration:
            "The compressed signal leaves the truck twice, on purpose: once up to a satellite dish on the roof, and once down a leased fibre line buried under the car park.",
          pip: "If one path drops, the other's already carrying me. Nobody at home ever notices the switch.",
          hotspot: { term: "uplink", label: "the uplink" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A satellite dish on top of the truck pointing to the sky, and a fibre cable running underground, both carrying the same signal">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <g class="art-dish">
              <path d="M300 200 Q260 120 340 100 Q400 130 360 200 Z" class="art-dish-bowl"/>
              <line x1="330" y1="150" x2="330" y2="60" class="art-dish-arm"/>
              <circle cx="330" cy="55" r="7" class="art-dish-feed"/>
            </g>
            <g class="art-uplink-beam">
              <path d="M330 55 L 300 10" class="art-beam"/>
              <path d="M330 55 L 360 10" class="art-beam"/>
              <path d="M330 55 L 330 5" class="art-beam"/>
            </g>
            <rect x="200" y="200" width="150" height="60" rx="6" class="art-truck-body"/>
            <path d="M30 260 L 460 260" class="art-fibre" stroke-dasharray="2 10"/>
            <text x="80" y="252" class="art-label-small">fibre, underground</text>
          </svg>`,
          more: {
            title: "Belt and braces",
            body: "Broadcasters call this redundancy \"belt and braces.\" For a global final, losing the picture for even a second is unacceptable, so every critical link in the chain — power, signal path, even the truck itself — usually has a backup running in parallel.",
          },
        },
      ],
    },
    {
      eyebrow: "CHAPTER 3 · RACING TO YOUR SCREEN",
      title: "The last mile",
      panels: [
        {
          heading: "36,000 kilometres, and back",
          narration:
            "Up at the satellite, the signal is repeated straight back down toward a receiving dish on the other side of the world. It's the longest single hop of the whole journey — and the only one measured in tens of thousands of kilometres.",
          pip: "This is the bit that takes actual, noticeable time. Light is fast, but that's still a long way to travel.",
          hotspot: { term: "satellite", label: "the satellite hop" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A satellite in orbit relaying a signal from the earth back down to a receiving station">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <path d="M-40 320 Q240 210 520 320" class="art-earth"/>
            <g class="art-crowd">${halftone(20, 250, 22, 2, 20, 2.6)}</g>
            <g class="art-sat">
              <rect x="220" y="60" width="40" height="24" rx="3" class="art-sat-body"/>
              <rect x="180" y="66" width="34" height="12" class="art-sat-panel"/>
              <rect x="266" y="66" width="34" height="12" class="art-sat-panel"/>
            </g>
            <path d="M120 250 L 232 78" class="art-beam-long"/>
            <path d="M248 78 L 380 250" class="art-beam-long"/>
            <circle cx="380" cy="255" r="10" class="art-dish-small"/>
          </svg>`,
          more: {
            title: "Why not skip the satellite?",
            body: "Fibre is faster and increasingly preferred where it's available end-to-end. Satellite still earns its place for reaching places fibre hasn't, and as that reliable backup path if a buried cable ever gets cut.",
          },
        },
        {
          heading: "One signal, many doors",
          narration:
            "At the broadcast centre, one incoming feed splits into dozens: a version for cable boxes, a version for satellite TV, and several more for the internet — each resized for a different kind of screen and connection.",
          pip: "By now there isn't just one of me. There are copies, heading everywhere at once.",
          hotspot: { term: "headend", label: "the broadcast centre" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A building where one signal splits into many paths leading to different devices">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <rect x="30" y="120" width="110" height="90" rx="6" class="art-truck-body"/>
            <rect x="55" y="140" width="60" height="16" class="art-truck-window"/>
            <path d="M140 150 L 220 90" class="art-split-line"/>
            <path d="M140 165 L 220 165" class="art-split-line"/>
            <path d="M140 180 L 220 240" class="art-split-line"/>
            <rect x="222" y="70" width="46" height="34" rx="3" class="art-monitor"/>
            <rect x="222" y="148" width="46" height="34" rx="3" class="art-monitor"/>
            <rect x="222" y="226" width="46" height="34" rx="3" class="art-monitor"/>
            <text x="300" y="92" class="art-label-small">cable</text>
            <text x="300" y="170" class="art-label-small">satellite TV</text>
            <text x="300" y="248" class="art-label-small">internet</text>
          </svg>`,
          more: {
            title: "Same match, different bitrates",
            body: "The internet versions aren't identical either — a phone on patchy mobile data gets a smaller, more compressed stream than a smart TV on fibre, so both keep playing smoothly instead of freezing to catch up.",
          },
        },
        {
          heading: "Nearest server wins",
          narration:
            "Rather than every viewer's device reaching all the way back to the broadcast centre, most connect instead to a nearby server — often in the same city — that already holds a copy of the stream.",
          pip: "It's why millions can watch the same goal at once without the whole system buckling. I don't have to travel the whole way for everyone.",
          hotspot: { term: "cdn", label: "a nearby server" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A globe with several small server nodes around it, each connected to nearby viewers">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <circle cx="240" cy="150" r="95" class="art-globe"/>
            <path d="M145 150 Q240 100 335 150" class="art-globe-line"/>
            <path d="M145 150 Q240 200 335 150" class="art-globe-line"/>
            <path d="M240 55 L 240 245" class="art-globe-line"/>
            <g class="art-node"><circle cx="140" cy="95" r="9"/><rect x="132" y="104" width="16" height="8"/></g>
            <g class="art-node"><circle cx="340" cy="95" r="9"/><rect x="332" y="104" width="16" height="8"/></g>
            <g class="art-node"><circle cx="90" cy="200" r="9"/><rect x="82" y="209" width="16" height="8"/></g>
            <g class="art-node"><circle cx="390" cy="200" r="9"/><rect x="382" y="209" width="16" height="8"/></g>
            <g class="art-node"><circle cx="240" cy="255" r="9"/><rect x="232" y="264" width="16" height="8"/></g>
          </svg>`,
          more: {
            title: "This trick isn't just for football",
            body: "This same idea — copies of content stored close to the viewer — is what makes most of the video internet work, from news clips to game downloads. It's called a content delivery network, and you're almost certainly using one right now.",
          },
        },
        {
          heading: "Goal.",
          narration:
            "A decoder chip in the TV rebuilds the picture, frame by frame, from the compact instructions the encoder wrote back at the stadium. A tiny buffer of frames waits in memory — just in case the next piece arrives a beat late.",
          pip: "And there we are — stadium to sofa, in well under two seconds. Not bad for a trip halfway round the world. See you at the next whistle!",
          hotspot: { term: "decoder", label: "the decoder" },
          art: `<svg viewBox="0 0 480 300" role="img" aria-label="A living room with a person on a sofa watching a television showing a football match, celebrating a goal">
            <rect x="0" y="0" width="480" height="300" class="art-bg"/>
            <rect x="130" y="60" width="220" height="140" rx="8" class="art-tv"/>
            <rect x="146" y="76" width="188" height="108" rx="3" class="art-tv-screen"/>
            <path d="M146 150 Q240 120 334 150" class="art-pitch-line-small"/>
            <circle cx="230" cy="130" r="5" class="art-ball"/>
            <rect x="228" y="192" width="4" height="20" class="art-tv-stand"/>
            <rect x="200" y="212" width="60" height="6" rx="3" class="art-tv-stand"/>
            <path d="M60 260 Q140 220 220 260 L220 300 L60 300 Z" class="art-sofa"/>
            <circle cx="110" cy="235" r="16" class="art-head"/>
            <rect x="86" y="250" width="48" height="34" rx="10" class="art-body"/>
          </svg>`,
          more: {
            title: "The whole journey, end to end",
            body: "Camera → truck → encoder → satellite or fibre → broadcast centre → nearby server → your decoder. A dozen handoffs, thousands of kilometres, and it happens in less time than it takes to blink twice.",
          },
        },
      ],
    },
  ],
};
