import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

interface NavBarProps {
  page: string;
  onNav: (p: string) => void;
}

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'website', label: 'Need a Website?' },
  { id: 'ranger', label: 'Ford Ranger XL 2024' },
  { id: 'play', label: '🎮 Play' },
  { id: 'contact', label: 'Contact' },
];

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="LVTS banner" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
          <button onClick={() => { onNav('home'); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <div className="pulse-ring" style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }} className="hidden-mobile">
          {LINKS.map(l => (
            <button key={l.id} onClick={() => onNav(l.id)}
              style={{
                background: page === l.id ? 'rgba(37,99,235,0.08)' : 'none',
                border: page === l.id ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent',
                color: page === l.id ? '#2563eb' : '#475569',
                padding: '0.45rem 1.1rem', borderRadius: 8,
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '0.875rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => onNav('contact')}
            style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', color: '#fff', padding: '0.45rem 1.2rem', borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', marginLeft: '0.5rem', transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Hire Me
          </button>
        </div>

        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer' }} className="mobile-menu-btn">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div style={{ background: 'rgba(255,255,255,0.98)', borderTop: '1px solid rgba(37,99,235,0.1)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          {LINKS.map(l => (
            <button key={l.id} onClick={() => { onNav(l.id); setOpen(false); }}
              style={{ background: 'none', border: 'none', color: page === l.id ? '#2563eb' : '#475569', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '1rem', textAlign: 'left', padding: '0.6rem 0', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {l.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:640px){
          .hidden-mobile{display:none!important;}
          .mobile-menu-btn{display:block!important;}
        }
      `}</style>
    </nav>
  );
}
