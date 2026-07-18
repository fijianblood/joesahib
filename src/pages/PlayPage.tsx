import { useEffect, useMemo, useState } from 'react';
import { Play, RotateCcw, CheckCircle2, Lock, Trophy, Lightbulb, Gamepad2 } from 'lucide-react';
import { useScrollFade } from '../hooks/useScrollFade';
import { runWeave } from '../lang/weave';
import { WEAVE_CHALLENGES, SANDBOX_SAMPLE, CHEATSHEET } from '../data/weaveChallenges';

const PROGRESS_KEY = 'weave_progress_v1';

function loadProgress(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p: Record<string, boolean>) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch { /* storage unavailable */ }
}

function outputsMatch(actual: string[], expected: string[]) {
  if (actual.length !== expected.length) return false;
  return actual.every((line, i) => line.trim() === expected[i].trim());
}

export default function PlayPage() {
  const heroRef = useScrollFade();
  const [mode, setMode] = useState<'challenges' | 'sandbox'>('challenges');
  const [progress, setProgress] = useState<Record<string, boolean>>(() => loadProgress());
  const [levelIdx, setLevelIdx] = useState(0);
  const [code, setCode] = useState(WEAVE_CHALLENGES[0].starter);
  const [sandboxCode, setSandboxCode] = useState(SANDBOX_SAMPLE);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [sandboxHasRun, setSandboxHasRun] = useState(false);

  const level = WEAVE_CHALLENGES[levelIdx];
  const solvedCount = useMemo(() => Object.values(progress).filter(Boolean).length, [progress]);

  useEffect(() => {
    setCode(level.starter);
    setOutput([]);
    setError(undefined);
    setSolved(false);
    setShowHint(false);
    setHasRun(false);
  }, [levelIdx, level.starter]);

  function runChallenge() {
    const result = runWeave(code);
    setOutput(result.output);
    setError(result.error);
    setHasRun(true);
    if (!result.error && outputsMatch(result.output, level.expected)) {
      setSolved(true);
      if (!progress[level.id]) {
        const next = { ...progress, [level.id]: true };
        setProgress(next);
        saveProgress(next);
      }
    } else {
      setSolved(false);
    }
  }

  function runSandbox() {
    const result = runWeave(sandboxCode);
    setOutput(result.output);
    setError(result.error);
    setSandboxHasRun(true);
  }

  const isUnlocked = (idx: number) => idx === 0 || progress[WEAVE_CHALLENGES[idx - 1].id];

  const consoleStyle: React.CSSProperties = {
    background: '#0a1120',
    border: '1px solid #1e3355',
    borderRadius: 10,
    padding: '1rem',
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: '0.8rem',
    color: '#d1e5ff',
    minHeight: 160,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowY: 'auto',
    maxHeight: 320,
  };

  const editorStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 220,
    background: '#0d1f3c',
    border: '1px solid #1e3355',
    borderRadius: 10,
    padding: '1rem',
    color: '#e6f0ff',
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: '0.8rem',
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
  };

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '120px 1.5rem 50px', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(124,58,237,0.08)', top: '-10%', left: '-5%' }} />
        <div ref={heroRef} className="fade-in" style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.75rem' }}>
            <Gamepad2 size={14} /> Interactive
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
            The <span className="grad-text">Weave</span> Playground
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.75 }}>
            A tiny coding language I built where the keywords are web-dev concepts — <code style={{ color: '#0891b2' }}>state</code>, <code style={{ color: '#0891b2' }}>component</code>, <code style={{ color: '#0891b2' }}>mount</code>, <code style={{ color: '#0891b2' }}>route</code>. Real interpreter, running live in your browser. Play through the levels or freestyle in the sandbox.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {(['challenges', 'sandbox'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                background: mode === m ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#fff',
                color: mode === m ? '#fff' : '#475569',
                border: mode === m ? 'none' : '1px solid #e2e8f0',
                padding: '0.6rem 1.4rem', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                fontFamily: "'Space Grotesk',sans-serif",
              }}>
              {m === 'challenges' ? '🎮 Challenges' : '🛠 Sandbox'}
            </button>
          ))}
        </div>

        {mode === 'challenges' ? (
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* Level list */}
            <div>
              <div className="card-3d" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.2rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Trophy size={18} color="#d97706" />
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{solvedCount} / {WEAVE_CHALLENGES.length} Levels Complete</div>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(solvedCount / WEAVE_CHALLENGES.length) * 100}%`, background: 'linear-gradient(90deg,#2563eb,#7c3aed)', transition: 'width 0.4s ease' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {WEAVE_CHALLENGES.map((c, idx) => {
                  const unlocked = isUnlocked(idx);
                  const done = !!progress[c.id];
                  return (
                    <button key={c.id} disabled={!unlocked} onClick={() => setLevelIdx(idx)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem', textAlign: 'left',
                        background: idx === levelIdx ? 'rgba(37,99,235,0.08)' : '#fff',
                        border: idx === levelIdx ? '1px solid rgba(37,99,235,0.4)' : '1px solid #e2e8f0',
                        borderRadius: 10, padding: '0.75rem 0.9rem', cursor: unlocked ? 'pointer' : 'not-allowed',
                        opacity: unlocked ? 1 : 0.5, fontFamily: "'Space Grotesk',sans-serif",
                      }}>
                      {done ? <CheckCircle2 size={16} color="#16a34a" /> : unlocked ? <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #94a3b8', display: 'inline-block' }} /> : <Lock size={14} color="#94a3b8" />}
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: unlocked ? '#0f172a' : '#94a3b8' }}>{c.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editor + console */}
            <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
              <div className="card-3d" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.4rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', marginBottom: '0.4rem' }}>{level.title}</div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{level.brief}</p>

                <textarea spellCheck={false} value={code} onChange={e => setCode(e.target.value)} style={editorStyle} />

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.9rem', flexWrap: 'wrap' }}>
                  <button onClick={runChallenge}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', color: '#fff', padding: '0.6rem 1.3rem', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <Play size={15} /> Run
                  </button>
                  <button onClick={() => { setCode(level.starter); setOutput([]); setError(undefined); setSolved(false); setHasRun(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff', border: '1px solid #e2e8f0', color: '#475569', padding: '0.6rem 1.1rem', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <RotateCcw size={14} /> Reset
                  </button>
                  <button onClick={() => setShowHint(h => !h)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff', border: '1px solid #e2e8f0', color: '#d97706', padding: '0.6rem 1.1rem', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'Hint'}
                  </button>
                </div>

                {showHint && (
                  <pre style={{ marginTop: '0.8rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#92400e', fontFamily: "'JetBrains Mono',monospace", whiteSpace: 'pre-wrap' }}>{level.hint}</pre>
                )}

                {solved && (
                  <div style={{ marginTop: '0.9rem', background: 'linear-gradient(135deg,rgba(22,163,74,0.1),rgba(8,145,178,0.06))', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 10, padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} color="#16a34a" />
                      <span style={{ fontWeight: 700, color: '#166534', fontSize: '0.9rem' }}>Level solved! 🎉</span>
                    </div>
                    {levelIdx < WEAVE_CHALLENGES.length - 1 && (
                      <button onClick={() => setLevelIdx(i => i + 1)}
                        style={{ background: 'linear-gradient(135deg,#16a34a,#0891b2)', border: 'none', color: '#fff', padding: '0.5rem 1.1rem', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                        Next Level →
                      </button>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.4rem' }}>Output</div>
                  <div style={consoleStyle}>
                    {error ? <span style={{ color: '#f87171' }}>Error: {error}</span>
                      : output.length ? output.join('\n')
                      : hasRun ? <span style={{ color: '#475569' }}>(no output — your code ran, but nothing called mount() to print anything)</span>
                      : <span style={{ color: '#475569' }}>Run your code to see output here…</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="card-3d" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Free Sandbox</div>
                <button onClick={() => { setSandboxCode(SANDBOX_SAMPLE); setOutput([]); setError(undefined); setSandboxHasRun(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff', border: '1px solid #e2e8f0', color: '#475569', padding: '0.45rem 1rem', borderRadius: 8, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                  <RotateCcw size={13} /> Reset Sample
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: '1rem' }}>
                <textarea spellCheck={false} value={sandboxCode} onChange={e => setSandboxCode(e.target.value)} style={{ ...editorStyle, minHeight: 320 }} />
                <div style={{ ...consoleStyle, maxHeight: 320, minHeight: 320 }}>
                  {error ? <span style={{ color: '#f87171' }}>Error: {error}</span>
                    : output.length ? output.join('\n')
                    : sandboxHasRun ? <span style={{ color: '#475569' }}>(no output — nothing called mount() to print anything)</span>
                    : <span style={{ color: '#475569' }}>Hit Run to see the sample program execute, then edit the code directly — it's a real interpreter.</span>}
                </div>
              </div>
              <button onClick={runSandbox}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.9rem', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', color: '#fff', padding: '0.6rem 1.3rem', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                <Play size={15} /> Run
              </button>
            </div>
          </div>
        )}

        {/* Cheatsheet */}
        <div style={{ maxWidth: 1100, margin: '3rem auto 0' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', marginBottom: '0.75rem', textAlign: 'center' }}>Keyword Cheatsheet</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '0.75rem' }}>
            {CHEATSHEET.map(k => (
              <div key={k.code} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.8rem 1rem' }}>
                <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: '#0891b2', fontWeight: 700 }}>{k.code}</code>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{k.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
