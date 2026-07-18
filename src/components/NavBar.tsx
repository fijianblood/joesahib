import { useState, useEffect } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';

interface NavBarProps {
  page: string;
  onNav: (p: string) => void;
}

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'website', label: 'Website' },
  { id: 'threed', label: '🧊 3D Sites' },
  { id: 'ranger', label: 'Ranger XL' },
  { id: 'play', label: '🎮 Play' },
  { id: 'tools', label: '🛠 Tools' },
  { id: 'ask', label: '💬 Ask LvTS' },
  { id: 'contact', label: 'Contact' },
];

function externalHref(id: string) {
  return `${import.meta.env.BASE_URL}#${id}`;
}

export default function NavBar({ page, onNav }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-glass' : ''}`}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => { onNav('home'); setOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
            <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="LVTS banner" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.05rem', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' }} className="hidden-mobile nav-links">
          {LINKS.map(l => l.id === 'home' ? (
            <button key={l.id} onClick={() => onNav(l.id)}
              style={{
                background: page === l.id ? 'rgba(37,99,235,0.08)' : 'none',
                border: page === l.id ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent',
                color: page === l.id ? '#2563eb' : '#475569',
                padding: '0.4rem 0.5rem', borderRadius: 8,
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '0.76rem',
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
              {l.label}
            </button>
          ) : (
            <a key={l.id} href={externalHref(l.id)} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                background: 'none', border: '1px solid transparent',
                color: '#475569', padding: '0.4rem 0.5rem', borderRadius: 8,
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '0.76rem',
                cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
              {l.label} <ExternalLink size={10} />
            </a>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer' }} className="mobile-menu-btn">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div style={{ background: 'rgba(255,255,255,0.98)', borderTop: '1px solid rgba(37,99,235,0.1)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          {LINKS.map(l => l.id === 'home' ? (
            <button key={l.id} onClick={() => { onNav(l.id); setOpen(false); }}
              style={{ background: 'none', border: 'none', color: page === l.id ? '#2563eb' : '#475569', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '1rem', textAlign: 'left', padding: '0.6rem 0', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {l.label}
            </button>
          ) : (
            <a key={l.id} href={externalHref(l.id)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '1rem', textAlign: 'left', padding: '0.6rem 0', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
              {l.label} <ExternalLink size={13} />
            </a>
          ))}
        </div>
      )}

      <style>{`
        .nav-links::-webkit-scrollbar{display:none;}
        @media(max-width:900px){
          .hidden-mobile{display:none!important;}
          .mobile-menu-btn{display:block!important;}
        }
      `}</style>
    </nav>
  );
}
