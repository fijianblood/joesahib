interface MediTrackPageProps {
  onNav: (page: string) => void;
}

export default function MediTrackPage({ onNav }: MediTrackPageProps) {
  return (
    <section style={{ padding: '96px 1.5rem 100px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 420, height: 420, background: 'rgba(193,68,59,0.06)', top: '-5%', right: '-5%' }} />
      <div className="orb" style={{ width: 280, height: 280, background: 'rgba(47,111,118,0.08)', bottom: '5%', left: '0%', animationDelay: '2s' }} />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0891b2', marginBottom: '0.75rem' }}>
          MediTrack Fiji · Local Only
        </div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
          <span className="grad-text">MediTrack</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.75 }}>
          Blood pressure trends, blood results, doctor's appointments, visit history, and medical history — all in
          one dashboard. Every entry saves to this device only. Nothing uploads, nothing leaves your browser.
        </p>
      </div>

      <div
        style={{
          maxWidth: 760,
          margin: '0 auto 2.5rem',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(15,23,42,0.12)',
          background: '#F6F3EC',
          position: 'relative',
        }}
      >
        <iframe
          src={`${import.meta.env.BASE_URL}meditrack/index.html`}
          title="MediTrack Fiji"
          style={{ width: '100%', height: '90vh', minHeight: 760, border: 'none', display: 'block' }}
          loading="lazy"
        />
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.04em', color: '#2563eb', marginBottom: '0.75rem' }}>
            A REAL SCENARIO
          </div>
          <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1rem' }}>
            For 5 years, someone gets a blood test done every year and saves the file in a laptop folder. On its
            own, that file does nothing. But if something ever happens to them — with one click, someone close can
            open 5 years of history on a clear dashboard for the doctor — and the data never left the laptop.
          </p>
          <p style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.95rem' }}>
            That's what we build, together.
          </p>
        </div>

        <button
          onClick={() => onNav('contact')}
          style={{ display: 'block', width: '100%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', color: '#fff', padding: '1.1rem', borderRadius: 14, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', transition: 'transform 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Let's Discuss →
        </button>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '1.25rem' }}>
          Raiwai, Suva, Fiji · lomavatatechfiji@gmail.com · 7466941 / 8331088
        </p>
      </div>
    </section>
  );
}
