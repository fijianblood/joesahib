// Extracts embedded JPEG preview images from RAW/DNG files by scanning for
// JPEG SOI/EOI markers. DNG (including Apple ProRAW) stores a full-size JPEG
// preview alongside the raw sensor data for compatibility — this pulls that
// out instead of doing true RAW demosaicing, which browsers can't do anyway.

function findMarkerPositions(bytes: Uint8Array, b1: number, b2: number): number[] {
  const positions: number[] = [];
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === b1 && bytes[i + 1] === b2) positions.push(i);
  }
  return positions;
}

export function extractJpegCandidates(buffer: ArrayBuffer): Blob[] {
  const bytes = new Uint8Array(buffer);
  const soiList = findMarkerPositions(bytes, 0xff, 0xd8);
  const eoiList = findMarkerPositions(bytes, 0xff, 0xd9);
  if (!soiList.length || !eoiList.length) return [];

  const spans: { start: number; end: number }[] = [];
  for (let s = 0; s < soiList.length; s++) {
    const soi = soiList[s];
    const nextSoi = s + 1 < soiList.length ? soiList[s + 1] : bytes.length;
    let chosenEoi = -1;
    for (const eoi of eoiList) {
      if (eoi <= soi) continue;
      if (eoi >= nextSoi) break;
      chosenEoi = eoi;
    }
    if (chosenEoi !== -1) spans.push({ start: soi, end: chosenEoi + 2 });
  }

  spans.sort((a, b) => (b.end - b.start) - (a.end - a.start));
  return spans.slice(0, 5).map(sp => new Blob([bytes.slice(sp.start, sp.end)], { type: 'image/jpeg' }));
}
