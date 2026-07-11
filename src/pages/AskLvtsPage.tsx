import { ExternalLink, MessageCircle, Link2 } from 'lucide-react';
import { useScrollFade } from '../hooks/useScrollFade';

interface ResourceLink {
  label: string;
  desc: string;
  url: string;
  color: string;
}

const LINKS: ResourceLink[] = [
  { label: 'Wikipedia', desc: 'Look things up on the free online encyclopedia', url: 'https://www.wikipedia.org/', color: '#2563eb' },
];

export default function AskLvtsPage() {
  const heroRef = useScrollFade();

  return (
    <>
      <section style={{ padding: '120px 1.5rem 80px', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(124,58,237,0.07)', top: '-8%', left: '-5%' }} />

        <div ref={heroRef} className="fade-in" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.75rem' }}>
            <MessageCircle size={14} /> Quick Links
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
            Ask <span className="grad-text">LvTS</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.75 }}>
            Handy resources and references, one click away.
          </p>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {LINKS.map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="card-3d"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: '#fff', border: `1px solid ${l.color}25`, borderLeft: `3px solid ${l.color}`, borderRadius: 12, padding: '1.1rem 1.4rem', textDecoration: 'none', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{ color: l.color }}><Link2 size={20} /></div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{l.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{l.desc}</div>
                </div>
              </div>
              <ExternalLink size={16} color="#94a3b8" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
