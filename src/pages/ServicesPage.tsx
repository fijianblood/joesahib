import { useScrollFade } from '../hooks/useScrollFade';
import { Monitor, Wrench, Wifi, ShieldCheck, Globe, Printer } from 'lucide-react';

const SERVICES = [
  {
    icon: <Wrench size={28} />,
    title: 'PC & Laptop Repair',
    color: '#2563eb',
    desc: 'Any brand, any problem. Hardware faults, screen replacement, OS install, virus removal. Repairs from FJD $25.',
    video: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Flvtsfiji%2Fvideos%2F688488585674443%2F&show_text=false&width=382&t=0',
    tags: ['Dell','HP','Acer','ASUS','Toshiba','Apple'],
  },
  {
    icon: <Monitor size={28} />,
    title: 'Commercial Gas Oven',
    color: '#f59e0b',
    desc: 'Supply and service of commercial gas ovens for bakeries, restaurants, and food businesses across Fiji.',
    video: 'https://www.youtube.com/embed/HeQvnVyRKL0?si=d8BfJr-YfsCBa1Aa',
    tags: ['Commercial','Supply','Service','Warranty'],
  },
  {
    icon: <Globe size={28} />,
    title: 'Vitikart Store Setup',
    color: '#06b6d4',
    desc: 'Get your own online store on Vitikart.com.fj. Sell products digitally in Fiji with your own marketplace page.',
    video: 'https://www.youtube.com/embed/eG8yy1N62h4?si=8rqO9h1NGXL1NYvp',
    tags: ['eCommerce','Digital','Fiji','Online'],
  },
];

const EXTRA = [
  { icon: <ShieldCheck size={20} />, title: 'Antivirus & Security', desc: 'Remove viruses, malware, ransomware. Install proper antivirus protection.' },
  { icon: <Wifi size={20} />, title: 'Network & CCTV', desc: 'Home and office network setup, CCTV installation and configuration.' },
  { icon: <Globe size={20} />, title: 'Web Designing', desc: 'Modern websites, landing pages and portfolio sites for your business.' },
  { icon: <Monitor size={20} />, title: 'Software & OS', desc: 'Windows 10/11 installation, Microsoft Office, driver updates.' },
  { icon: <Printer size={20} />, title: 'Printer & Peripherals', desc: 'OKI MC342w color printer setup. Toner, drums, and maintenance.' },
  { icon: <ShieldCheck size={20} />, title: 'Email Hosting', desc: 'Business email setup, hosting, and domain configuration.' },
];

export default function ServicesPage({ onNav }: { onNav: (p: string) => void }) {
  const heroRef = useScrollFade();
  const extraRef = useScrollFade();
  const flyerRef = useScrollFade();

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '120px 1.5rem 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(37,99,235,0.06)', top: '-10%', right: '-5%' }} />

        <div ref={heroRef} className="fade-in" style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', marginBottom: '0.75rem' }}>What We Do</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
            Tech Services Built for <span className="grad-text">Fiji</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.75 }}>
            From laptop repairs to full network installations — LomaVata Tech Services covers all your IT needs across Suva and the wider Fiji region.
          </p>
        </div>

        {/* Main service cards with video */}
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {SERVICES.map((s, i) => {
            const ref = useScrollFade();
            return (
              <div key={s.title} ref={ref} className="fade-in card-3d"
                style={{ background: '#fff', border: `1px solid ${s.color}30`, borderTop: `3px solid ${s.color}`, borderRadius: 14, overflow: 'hidden', transitionDelay: `${i * 0.1}s` }}>
                {/* Video */}
                <div style={{ position: 'relative', paddingBottom: '60%', height: 0, overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src={s.video}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={s.title}
                  />
                </div>
                <div style={{ padding: '1.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ color: s.color }}>{s.icon}</div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{s.title}</h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.7, marginBottom: '1rem' }}>{s.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {s.tags.map(t => (
                      <span key={t} style={{ background: `${s.color}18`, border: `1px solid ${s.color}35`, color: s.color, borderRadius: 6, padding: '0.2rem 0.55rem', fontSize: '0.7rem', fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional services grid */}
      <section style={{ padding: '60px 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={extraRef} className="fade-in" style={{ marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', marginBottom: '0.5rem' }}>Full Offerings</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '2rem', color: '#0f172a' }}>Everything We Cover</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem' }}>
            {EXTRA.map((e, i) => (
              <div key={e.title} className="card-3d"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.3rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', transitionDelay: `${i * 0.05}s` }}>
                <div style={{ color: '#06b6d4', flexShrink: 0, marginTop: 2 }}>{e.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem', fontSize: '0.95rem' }}>{e.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Laptop Repair Flyer + Map */}
      <section style={{ padding: '80px 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2rem', alignItems: 'start' }}>
          <div ref={flyerRef} className="fade-in">
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', marginBottom: '1rem' }}>Repair Flyer</div>
            <div className="card-3d" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <img src="/laptop-flyer.jpg" alt="Laptop Repair Services" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg,rgba(37,99,235,0.12),rgba(6,182,212,0.04))', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 12, padding: '1.2rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Laptop/Computer/Printer</div>
              <div style={{ fontSize: '1.5rem', fontFamily: "'Syne',sans-serif", fontWeight: 800, color: '#06b6d4' }}>Repairs from FJD $25</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>Any brand · Any problem · Suva & surrounds</div>
              <button onClick={() => onNav('contact')}
                style={{ marginTop: '1rem', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', color: '#fff', padding: '0.65rem 1.4rem', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                Book a Repair
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', marginBottom: '1rem' }}>Find Us</div>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3791.4908083861474!2d178.44417367348993!3d-18.14129068510718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6e1be1d0639b9073%3A0x67333a292be35182!2sLomaVata%20Tech%20Services!5e0!3m2!1sen!2sfj!4v1781860419297!5m2!1sen!2sfj"
                width="100%" height="340" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" title="LomaVata Tech Services Location"
              />
            </div>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Address', value: 'Raiwai, Suva, Fiji' },
                { label: 'Phone', value: '8331088 / 7466941' },
                { label: 'Email', value: 'lomavata88@gmail.com' },
                { label: 'TikTok', value: '@fijianblood8' },
              ].map(c => (
                <div key={c.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.8rem' }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563eb', marginBottom: '0.2rem' }}>{c.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
