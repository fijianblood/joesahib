import { useEffect, useRef, useState } from 'react';
import { Send, Loader2, AlertCircle, Trash2, MessageCircle, ExternalLink } from 'lucide-react';
import { useScrollFade } from '../hooks/useScrollFade';

// Set this to your deployed Cloudflare Worker URL — see /cloudflare-worker/README.md
const PROXY_URL = 'https://REPLACE-WITH-YOUR-WORKER-URL.workers.dev';

interface Source { url: string; title: string; }
interface ChatMsg { role: 'user' | 'assistant'; content: string; sources?: Source[]; }

const HISTORY_KEY = 'lvts_ask_history_v1';
const GREETING: ChatMsg = { role: 'assistant', content: "Bula! Ask me anything about IT, web development, or LomaVata Tech Services — I can look things up live if it helps." };

function loadHistory(): ChatMsg[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* storage unavailable */ }
  return [GREETING];
}

export default function AskLvtsPage() {
  const heroRef = useScrollFade();
  const [messages, setMessages] = useState<ChatMsg[]>(loadHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const proxyConfigured = !PROXY_URL.includes('REPLACE-WITH-YOUR-WORKER-URL');

  useEffect(() => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(messages)); } catch { /* storage unavailable */ }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function clearChat() {
    setMessages([GREETING]);
    setError('');
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError('');
    const nextMessages: ChatMsg[] = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Request failed (${res.status})`);
      }
      const blocks: Array<Record<string, unknown>> = Array.isArray(data.content) ? data.content : [];
      const replyText = blocks.filter(b => b.type === 'text').map(b => b.text as string).join('\n').trim() || "I couldn't find a clear answer to that.";
      const sources: Source[] = [];
      blocks.forEach(block => {
        if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
          (block.content as Array<Record<string, unknown>>).forEach(r => {
            const url = r.url as string, title = r.title as string;
            if (url && title && !sources.some(s => s.url === url)) sources.push({ url, title });
          });
        }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: replyText, sources }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong reaching the assistant. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section style={{ padding: '120px 1.5rem 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(124,58,237,0.07)', top: '-8%', left: '-5%' }} />

        <div ref={heroRef} className="fade-in" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.75rem' }}>
            <MessageCircle size={14} /> Live Assistant
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
            Ask <span className="grad-text">LvTS</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.75 }}>
            Chat with LomaVata Tech's assistant — it can search the web for current info when it needs to, and cites its sources.
          </p>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {!proxyConfigured && (
            <div style={{ marginBottom: '1rem', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: 10, padding: '0.9rem 1.1rem', fontSize: '0.85rem', color: '#92400e' }}>
              ⚠️ This chat isn't connected to the assistant yet — the site owner still needs to finish setup (see <code>/cloudflare-worker/README.md</code>).
            </div>
          )}

          <div className="card-3d" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', height: 560, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.2rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>Ask LvTS</div>
              <button onClick={clearChat} title="Clear chat"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', padding: '0.35rem 0.7rem', borderRadius: 7, fontSize: '0.75rem', cursor: 'pointer' }}>
                <Trash2 size={13} /> Clear
              </button>
            </div>

            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '0.7rem 0.95rem', borderRadius: 12, fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    background: m.role === 'user' ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#f8fafc',
                    color: m.role === 'user' ? '#fff' : '#0f172a',
                    border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    borderBottomRightRadius: m.role === 'user' ? 4 : 12,
                    borderBottomLeftRadius: m.role === 'user' ? 12 : 4,
                  }}>
                    {m.content}
                    {m.sources && m.sources.length > 0 && (
                      <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.72rem' }}>
                        <div style={{ color: '#94a3b8', marginBottom: '0.3rem' }}>Sources:</div>
                        {m.sources.slice(0, 4).map(s => (
                          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#2563eb', textDecoration: 'none', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <ExternalLink size={11} style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '0.7rem 0.95rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, borderBottomLeftRadius: 4 }}>
                  <span className="chat-dot" /> <span className="chat-dot" style={{ animationDelay: '0.15s' }} /> <span className="chat-dot" style={{ animationDelay: '0.3s' }} />
                </div>
              )}

              {error && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626', padding: '0.6rem 0.9rem', borderRadius: 10, fontSize: '0.8rem' }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </div>

            <form onSubmit={e => { e.preventDefault(); send(); }} style={{ display: 'flex', gap: '0.6rem', padding: '0.9rem', borderTop: '1px solid #e2e8f0' }}>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a question…" disabled={loading}
                style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', padding: '0.65rem 0.9rem', borderRadius: 9, fontSize: '0.875rem', outline: 'none' }} />
              <button type="submit" disabled={loading || !input.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', color: '#fff', padding: '0 1.1rem', borderRadius: 9, fontWeight: 700, fontSize: '0.85rem', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', opacity: loading || !input.trim() ? 0.5 : 1 }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
            Your chat stays in your own browser between visits — nothing is shared with anyone else.
          </div>
        </div>
      </section>
    </>
  );
}
