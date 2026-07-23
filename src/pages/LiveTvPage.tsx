import { useEffect, useRef, useState } from 'react';

export default function LiveTvPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let observer: ResizeObserver | undefined;

    function attach() {
      try {
        const doc = iframe!.contentDocument;
        if (!doc) return;
        const measure = () => setHeight(doc.documentElement.scrollHeight);
        measure();
        observer = new ResizeObserver(measure);
        observer.observe(doc.documentElement);
      } catch {
        // cross-origin fallback — keep the default height
      }
    }

    iframe.addEventListener('load', attach);
    return () => {
      iframe.removeEventListener('load', attach);
      observer?.disconnect();
    };
  }, []);

  return (
    <section style={{ padding: '96px 1.5rem 100px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 420, height: 420, background: 'rgba(6,182,212,0.08)', top: '-5%', right: '-5%' }} />
      <div className="orb" style={{ width: 280, height: 280, background: 'rgba(124,58,237,0.06)', bottom: '5%', left: '0%', animationDelay: '2s' }} />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0891b2', marginBottom: '0.75rem' }}>
          Powered by iptv-org/api
        </div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
          <span className="grad-text">Live TV</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.75 }}>
          Thousands of free-to-air channels from around the world, searchable by country and category, playing
          right in your browser — built on the open iptv-org channel directory. Every stream link was individually
          tested and confirmed working before being listed; dead links were removed.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <iframe
          ref={iframeRef}
          src={`${import.meta.env.BASE_URL}tv/index.html`}
          title="Live TV"
          style={{ width: '100%', height, border: 'none', display: 'block', borderRadius: 20, overflow: 'hidden' }}
        />
      </div>
    </section>
  );
}
