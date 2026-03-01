export function toHex(byte: number): string {
  return byte.toString(16).toUpperCase().padStart(2, '0');
}

export function formatAddress(offset: number, width = 8): string {
  return offset.toString(16).toUpperCase().padStart(width, '0');
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function byteToAscii(byte: number): string {
  if (byte >= 0x20 && byte <= 0x7e) return String.fromCharCode(byte);
  return '.';
}

export const BYTES_PER_ROW = 16;

export function getRowCount(dataLength: number): number {
  return Math.ceil(dataLength / BYTES_PER_ROW);
}

export function getRowBytes(data: Uint8Array, rowIndex: number): Uint8Array {
  const start = rowIndex * BYTES_PER_ROW;
  const end = Math.min(start + BYTES_PER_ROW, data.length);
  return data.slice(start, end);
}

