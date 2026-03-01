import type { InspectorResult } from '../types/hex';

export function inspectBytes(data: Uint8Array, offset: number, length: number): InspectorResult {
  const slice = data.slice(offset, offset + Math.min(length, 8));
  const buf = slice.buffer.slice(slice.byteOffset, slice.byteOffset + slice.byteLength);
  const view = new DataView(buf);

  const b0 = slice[0] ?? 0;

  const binary = Array.from(slice.slice(0, 4))
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');

  const hex = Array.from(slice).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

  const ascii = Array.from(slice)
    .map(b => (b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : '.'))
    .join('');

  let utf8 = '';
  try { utf8 = new TextDecoder('utf-8').decode(slice); } catch { utf8 = ascii; }

  const get = (fn: () => number): number | null => { try { return fn(); } catch { return null; } };

  const uint16le = slice.length >= 2 ? get(() => view.getUint16(0, true)) : null;
  const int16le  = slice.length >= 2 ? get(() => view.getInt16(0, true))  : null;
  const uint16be = slice.length >= 2 ? get(() => view.getUint16(0, false)) : null;
  const int16be  = slice.length >= 2 ? get(() => view.getInt16(0, false))  : null;

  const uint24le = slice.length >= 3
    ? (slice[0] | (slice[1] << 8) | (slice[2] << 16)) >>> 0
    : null;
  const uint24be = slice.length >= 3
    ? ((slice[0] << 16) | (slice[1] << 8) | slice[2]) >>> 0
    : null;

  const uint32le = slice.length >= 4 ? get(() => view.getUint32(0, true))  : null;
  const int32le  = slice.length >= 4 ? get(() => view.getInt32(0, true))   : null;
  const uint32be = slice.length >= 4 ? get(() => view.getUint32(0, false)) : null;
  const int32be  = slice.length >= 4 ? get(() => view.getInt32(0, false))  : null;

  const float32le = slice.length >= 4 ? get(() => view.getFloat32(0, true))  : null;
  const float32be = slice.length >= 4 ? get(() => view.getFloat32(0, false)) : null;
  const float64le = slice.length >= 8 ? get(() => view.getFloat64(0, true))  : null;
  const float64be = slice.length >= 8 ? get(() => view.getFloat64(0, false)) : null;

  const rgb = slice.length >= 3
    ? { r: slice[0], g: slice[1], b: slice[2] }
    : null;

  const rgba = slice.length >= 4
    ? { r: slice[0], g: slice[1], b: slice[2], a: slice[3] }
    : null;

  let rgb565 = null;
  if (slice.length >= 2) {
    const val = (slice[0] | (slice[1] << 8));
    const r = ((val >> 11) & 0x1f) << 3;
    const g = ((val >> 5) & 0x3f) << 2;
    const b = (val & 0x1f) << 3;
    rgb565 = { r, g, b };
  }

  return {
    binary,
    hex,
    uint8: b0,
    int8: b0 > 127 ? b0 - 256 : b0,
    uint16le, int16le, uint16be, int16be,
    uint24le, uint24be,
    uint32le, int32le, uint32be, int32be,
    float32le, float32be,
    float64le, float64be,
    ascii,
    utf8,
    rgb,
    rgba,
    rgb565,
  };
}

export function formatFloat(n: number | null): string {
  if (n === null) return '--';
  if (!isFinite(n)) return n > 0 ? 'Inf' : n < 0 ? '-Inf' : 'NaN';
  return n.toFixed(6);
}

