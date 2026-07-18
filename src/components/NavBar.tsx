import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Globe, Box, Car, Gamepad2, Hammer, MessageCircle, Mail } from 'lucide-react';

interface NavBarProps {
  page: string;
  onNav: (p: string) => void;
}

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'threed', label: '3D Sites', icon: Box },
  { id: 'ranger', label: 'Ranger XL', icon: Car },
  { id: 'play', label: 'Play', icon: Gamepad2 },
  { id: 'tools', label: 'Tools', icon: Hammer },
  { id: 'ask', label: 'Ask LvTS', icon: MessageCircle },
  { id: 'contact', label: 'Contact', icon: Mail },
];

function externalHref(id: string) {
  return `${import.meta.env.BASE_URL}#${id}`;
}

const BASE_SIZE = 44;
const MAX_SCALE = 1.5;
const INFLUENCE = 100;

export default function NavBar({ page, onNav }: NavBarProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const mouseX = e.clientX;
    itemRefs.current.forEach(el => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - center);
      const scale = dist < INFLUENCE ? 1 + (MAX_SCALE - 1) * (1 - dist / INFLUENCE) : 1;
      el.style.transform = `translateY(${-(scale - 1) * 20}px) scale(${scale})`;
    });
  }

  function resetDock() {
    itemRefs.current.forEach(el => { if (el) el.style.transform = 'translateY(0) scale(1)'; });
  }

  return (
    <nav style={{ position: 'fixed', bottom: 16, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={resetDock}
        className="dock"
        style={{
          pointerEvents: 'auto', display: 'flex', alignItems: 'flex-end', gap: 10,
          padding: '10px 14px', borderRadius: 22, maxWidth: 'calc(100vw - 20px)',
          background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px rgba(15,23,42,0.18), 0 1px 0 rgba(255,255,255,0.4) inset',
        }}>
        {LINKS.map((l, i) => {
          const Icon = l.icon;
          const active = page === l.id;
          const tile = (
            <div
              ref={el => { itemRefs.current[i] = el; }}
              className="dock-item"
              style={{
                width: BASE_SIZE, height: BASE_SIZE, borderRadius: 13, flexShrink: 0,
                background: active ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#fff',
                border: active ? 'none' : '1px solid rgba(15,23,42,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                boxShadow: active ? '0 6px 16px rgba(37,99,235,0.35)' : '0 2px 6px rgba(15,23,42,0.08)',
                transformOrigin: 'bottom center', transition: 'transform 0.12s cubic-bezier(0.34,1.56,0.64,1)', cursor: 'pointer',
              }}>
              {l.id === 'home'
                ? <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Home" style={{ width: '70%', height: '70%', objectFit: 'contain', borderRadius: 6 }} />
                : Icon && <Icon size={20} color={active ? '#fff' : '#475569'} strokeWidth={2} />}
              <span className="dock-tooltip">{l.label}</span>
              {active && <span style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#2563eb' }} />}
            </div>
          );
          return l.id === 'home' ? (
            <motion.button key={l.id} onClick={() => onNav('home')} aria-label="Home"
              whileTap={{ scale: 0.85 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              {tile}
            </motion.button>
          ) : (
            <motion.a key={l.id} href={externalHref(l.id)} target="_blank" rel="noopener noreferrer" aria-label={l.label}
              whileTap={{ scale: 0.85 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
              {tile}
            </motion.a>
          );
        })}
      </div>

      <style>{`
        .dock::-webkit-scrollbar { display: none; }
        .dock-tooltip {
          position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%);
          background: rgba(15,23,42,0.92); color: #fff; font-size: 0.7rem; font-weight: 600;
          padding: 0.3rem 0.6rem; border-radius: 6px; white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity 0.15s;
        }
        .dock-item:hover .dock-tooltip { opacity: 1; }
        @media (max-width: 640px) {
          .dock { gap: 6px !important; padding: 8px 10px !important; overflow-x: auto; }
        }
      `}</style>
    </nav>
  );
}
