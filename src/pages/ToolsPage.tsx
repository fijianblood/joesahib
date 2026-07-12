import { useRef, useState } from 'react';
import type { jsPDF as JsPDFCtor } from 'jspdf';
import { UploadCloud, ArrowUp, ArrowDown, X, FileDown, Loader2, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { useScrollFade } from '../hooks/useScrollFade';
import { extractJpegCandidates } from '../lib/rawPreview';

interface ImgItem {
  id: number;
  file: File;
  url: string;
  w: number;
  h: number;
}

type PageSize = 'a4' | 'letter' | 'fit';
type Orientation = 'auto' | 'portrait' | 'landscape';

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function isSupportedFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  return /\.(heic|heif|dng)$/i.test(file.name);
}

function isHeic(file: File): boolean {
  return /^image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

function isDng(file: File): boolean {
  return /adobe-dng|x-dng/i.test(file.type) || /\.dng$/i.test(file.name);
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function loadImageDims(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error('Could not decode image'));
    img.src = url;
  });
}

// Converts a file into a browser-decodable image URL, handling HEIC/HEIF
// (via client-side conversion) and DNG/RAW (via embedded-preview extraction)
// transparently — everything downstream just sees a normal image URL.
async function resolveImageSource(file: File): Promise<{ url: string; w: number; h: number }> {
  let sourceBlob: Blob = file;

  if (isHeic(file)) {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    sourceBlob = Array.isArray(converted) ? converted[0] : converted;
  } else if (isDng(file)) {
    const buffer = await file.arrayBuffer();
    const candidates = extractJpegCandidates(buffer);
    if (!candidates.length) throw new Error('No embedded preview image found in this DNG file.');
    let found: Blob | null = null;
    for (const candidate of candidates) {
      const testUrl = URL.createObjectURL(candidate);
      try {
        await loadImageDims(testUrl);
        found = candidate;
        URL.revokeObjectURL(testUrl);
        break;
      } catch {
        URL.revokeObjectURL(testUrl);
      }
    }
    if (!found) throw new Error('Could not extract a usable preview from this DNG file.');
    sourceBlob = found;
  }

  const url = URL.createObjectURL(sourceBlob);
  const dims = await loadImageDims(url);
  return { url, w: dims.w, h: dims.h };
}

function toJpegDataUrl(url: string, w: number, h: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

let idCounter = 0;

export default function ToolsPage() {
  const heroRef = useScrollFade();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<ImgItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('auto');
  const [quality, setQuality] = useState(85);
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState<{ msg: string; type: 'ok' | 'err' | '' }>({ msg: '', type: '' });

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList).filter(isSupportedFile);
    if (!files.length) {
      setStatus({ msg: 'No valid image files found.', type: 'err' });
      return;
    }
    files.forEach(async file => {
      const id = idCounter++;
      try {
        const { url, w, h } = await resolveImageSource(file);
        setItems(prev => [...prev, { id, file, url, w, h }]);
      } catch {
        setStatus({ msg: `Couldn't read "${file.name}" — skipped.`, type: 'err' });
      }
    });
    setStatus({ msg: '', type: '' });
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function moveItem(id: number, dir: number) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }

  async function convert() {
    if (!items.length) return;

    // iOS Safari doesn't support jsPDF's auto-download — it either silently fails or gets
    // blocked as a popup if opened after the async work below. Open a blank tab now, while
    // we're still inside the click's trusted user-gesture window, then fill it in once ready.
    const ios = isIOS();
    const iosTab = ios ? window.open('', '_blank') : null;

    setConverting(true);
    setStatus({ msg: 'Converting…', type: '' });

    try {
      const { jsPDF } = await import('jspdf');
      let doc: JsPDFCtor | null = null;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setStatus({ msg: `Converting image ${i + 1} of ${items.length}…`, type: '' });

        const dataUrl = await toJpegDataUrl(item.url, item.w, item.h, quality / 100);
        const imgRatio = item.w / item.h;
        let orient: 'portrait' | 'landscape' = orientation === 'auto' ? (imgRatio >= 1 ? 'landscape' : 'portrait') : orientation;

        const format: string | number[] = pageSize === 'fit' ? [item.w, item.h] : pageSize;
        const unit = pageSize === 'fit' ? 'px' : 'mm';
        const jsOrientation: 'l' | 'p' = pageSize === 'fit' ? (imgRatio >= 1 ? 'l' : 'p') : (orient === 'landscape' ? 'l' : 'p');

        if (i === 0) {
          doc = new jsPDF({ orientation: jsOrientation, unit, format: format as string | number[] });
        } else {
          doc!.addPage(format as string | number[], jsOrientation);
        }

        const pageW = doc!.internal.pageSize.getWidth();
        const pageH = doc!.internal.pageSize.getHeight();

        let drawW: number, drawH: number;
        if (pageSize === 'fit') {
          drawW = pageW; drawH = pageH;
        } else {
          const scale = Math.min(pageW / item.w, pageH / item.h);
          drawW = item.w * scale;
          drawH = item.h * scale;
        }
        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;

        doc!.addImage(dataUrl, 'JPEG', x, y, drawW, drawH);
      }

      if (ios) {
        const blob = doc!.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        if (iosTab) {
          iosTab.location.href = blobUrl;
          setStatus({ msg: 'Done — opened in a new tab. Tap the Share icon and choose "Save to Files" to download it.', type: 'ok' });
        } else {
          // Popup was blocked even for the blank tab — fall back to opening in this tab.
          window.location.href = blobUrl;
          setStatus({ msg: 'Done — tap the Share icon and choose "Save to Files" to download it.', type: 'ok' });
        }
      } else {
        doc!.save('converted.pdf');
        setStatus({ msg: `Done — ${items.length} image${items.length > 1 ? 's' : ''} converted.`, type: 'ok' });
      }
    } catch (err) {
      console.error(err);
      iosTab?.close();
      setStatus({ msg: 'Something went wrong converting these images. Try again or use fewer files at once.', type: 'err' });
    } finally {
      setConverting(false);
    }
  }

  const selectStyle: React.CSSProperties = {
    width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a',
    padding: '0.6rem 0.75rem', borderRadius: 8, fontSize: '0.875rem', fontFamily: "'Space Grotesk',sans-serif",
  };

  return (
    <>
      <section style={{ padding: '120px 1.5rem 80px', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(37,99,235,0.06)', top: '-10%', right: '-5%' }} />

        <div ref={heroRef} className="fade-in" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', marginBottom: '0.75rem' }}>
            <Shield size={14} /> Free Tool
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
            Image <span className="grad-text">→ PDF</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.75 }}>
            Drop in any images, arrange the order, download one merged PDF. Everything happens right here in your browser — nothing is ever uploaded anywhere.
          </p>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div className="card-3d" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.8rem', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
              onDrop={e => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              style={{
                border: `2px dashed ${dragActive ? '#2563eb' : '#e2e8f0'}`,
                background: dragActive ? 'rgba(37,99,235,0.05)' : '#f8fafc',
                borderRadius: 12, padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s ease',
              }}>
              <UploadCloud size={32} color="#2563eb" style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginBottom: '0.3rem' }}>Click to choose images, or drag them here</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>JPG, PNG, WebP, GIF, BMP, HEIC/HEIF (iPhone), DNG (RAW) — any order, any number</div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif,.dng" multiple style={{ display: 'none' }}
              onChange={e => { handleFiles(e.target.files); e.target.value = ''; }} />

            {items.length > 0 && (
              <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {items.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.5rem 0.7rem' }}>
                    <img src={item.url} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0, background: '#e2e8f0' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{idx + 1}. {item.file.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: "'JetBrains Mono',monospace" }}>{formatSize(item.file.size)} · {item.w}×{item.h}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button onClick={() => moveItem(item.id, -1)} title="Move up"
                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => moveItem(item.id, 1)} title="Move down"
                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowDown size={14} />
                      </button>
                      <button onClick={() => removeItem(item.id)} title="Remove"
                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(180px,100%),1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.4rem' }}>Page Size</label>
                <select value={pageSize} onChange={e => setPageSize(e.target.value as PageSize)} style={selectStyle}>
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="fit">Fit to image</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.4rem' }}>Orientation</label>
                <select value={orientation} onChange={e => setOrientation(e.target.value as Orientation)} disabled={pageSize === 'fit'} style={{ ...selectStyle, opacity: pageSize === 'fit' ? 0.5 : 1 }}>
                  <option value="auto">Auto (match image)</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.4rem' }}>
                <span>Image Quality (smaller ⇄ sharper)</span>
                <span style={{ color: '#2563eb', fontFamily: "'JetBrains Mono',monospace" }}>{quality}%</span>
              </label>
              <input type="range" min={40} max={100} step={5} value={quality} onChange={e => setQuality(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }} />
            </div>

            <button onClick={convert} disabled={!items.length || converting}
              style={{
                marginTop: '1.4rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', color: '#fff', padding: '0.9rem', borderRadius: 10,
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.95rem',
                cursor: !items.length || converting ? 'not-allowed' : 'pointer', opacity: !items.length || converting ? 0.5 : 1,
              }}>
              {converting ? <><Loader2 size={18} className="animate-spin" /> Converting…</> : <><FileDown size={18} /> Convert to PDF</>}
            </button>

            {status.msg && (
              <div style={{ marginTop: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', color: status.type === 'ok' ? '#16a34a' : status.type === 'err' ? '#ef4444' : '#64748b' }}>
                {status.type === 'ok' && <CheckCircle2 size={15} />}
                {status.type === 'err' && <AlertCircle size={15} />}
                {status.msg}
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.7 }}>
            🔒 Runs 100% locally in your browser — your images never leave your device.<br />
            Brought to you free by <span style={{ fontWeight: 700, color: '#2563eb' }}>LomaVata Tech Services</span>.
          </div>
        </div>
      </section>
    </>
  );
}
