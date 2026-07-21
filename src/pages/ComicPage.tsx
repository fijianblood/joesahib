export default function ComicPage() {
  return (
    <section style={{ padding: '96px 1.5rem 100px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 420, height: 420, background: 'rgba(6,182,212,0.08)', top: '-5%', right: '-5%' }} />
      <div className="orb" style={{ width: 280, height: 280, background: 'rgba(124,58,237,0.06)', bottom: '5%', left: '0%', animationDelay: '2s' }} />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0891b2', marginBottom: '0.75rem' }}>
          Joey As Packet Tracer Presents
        </div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
          <span className="grad-text">Na Signala</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.75 }}>
          An interactive World Cup 2026 comic about how a big broadcast travels from the stadium to your screen —
          tap the art, follow Joey, and touch the tech for a plain-English explainer.
        </p>
      </div>

      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(15,23,42,0.12)',
          background: '#f7f0d8',
          position: 'relative',
        }}
      >
        <iframe
          src={`${import.meta.env.BASE_URL}comic/index.html`}
          title="Na Signala — an interactive World Cup 2026 networking comic"
          style={{ width: '100%', height: '80vh', minHeight: 560, border: 'none', display: 'block' }}
          loading="lazy"
        />
      </div>
    </section>
  );
}
