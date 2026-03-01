import type { MagicByteMatch } from '../types/hex';

interface Signature {
  bytes: (number | null)[];
  offset: number;
  format: string;
  description: string;
}

const SIGNATURES: Signature[] = [
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], offset: 0, format: 'PNG', description: 'Portable Network Graphics' },
  { bytes: [0xff, 0xd8, 0xff], offset: 0, format: 'JPEG', description: 'JPEG Image' },
  { bytes: [0x47, 0x49, 0x46, 0x38], offset: 0, format: 'GIF', description: 'Graphics Interchange Format' },
  { bytes: [0x42, 0x4d], offset: 0, format: 'BMP', description: 'Bitmap Image' },
  { bytes: [0x49, 0x49, 0x2a, 0x00], offset: 0, format: 'TIFF-LE', description: 'TIFF (Little-Endian)' },
  { bytes: [0x4d, 0x4d, 0x00, 0x2a], offset: 0, format: 'TIFF-BE', description: 'TIFF (Big-Endian)' },
  { bytes: [0x25, 0x50, 0x44, 0x46], offset: 0, format: 'PDF', description: 'Portable Document Format' },
  { bytes: [0x50, 0x4b, 0x03, 0x04], offset: 0, format: 'ZIP', description: 'ZIP Archive' },
  { bytes: [0x50, 0x4b, 0x05, 0x06], offset: 0, format: 'ZIP-EMPTY', description: 'ZIP Archive (Empty)' },
  { bytes: [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07], offset: 0, format: 'RAR', description: 'RAR Archive' },
  { bytes: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c], offset: 0, format: '7-ZIP', description: '7-Zip Archive' },
  { bytes: [0x1f, 0x8b], offset: 0, format: 'GZIP', description: 'GNU Zip' },
  { bytes: [0x42, 0x5a, 0x68], offset: 0, format: 'BZIP2', description: 'bzip2 Compressed Data' },
  { bytes: [0x4d, 0x5a], offset: 0, format: 'PE/EXE', description: 'Windows PE Executable' },
  { bytes: [0x7f, 0x45, 0x4c, 0x46], offset: 0, format: 'ELF', description: 'ELF Executable' },
  { bytes: [0xca, 0xfe, 0xba, 0xbe], offset: 0, format: 'JAVA CLASS', description: 'Java Class File' },
  { bytes: [0xfe, 0xed, 0xfa, 0xce], offset: 0, format: 'MACHO-32', description: 'Mach-O 32-bit Executable' },
  { bytes: [0xfe, 0xed, 0xfa, 0xcf], offset: 0, format: 'MACHO-64', description: 'Mach-O 64-bit Executable' },
  { bytes: [0xff, 0xfb], offset: 0, format: 'MP3', description: 'MPEG-1 Layer 3 Audio' },
  { bytes: [0x49, 0x44, 0x33], offset: 0, format: 'MP3-ID3', description: 'MP3 with ID3 Tag' },
  { bytes: [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x41, 0x56, 0x45], offset: 0, format: 'WAV', description: 'Waveform Audio' },
  { bytes: [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x41, 0x56, 0x49, 0x20], offset: 0, format: 'AVI', description: 'Audio Video Interleave' },
  { bytes: [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70], offset: 0, format: 'MP4/MOV', description: 'MPEG-4 / QuickTime' },
  { bytes: [0x1a, 0x45, 0xdf, 0xa3], offset: 0, format: 'MKV/WEBM', description: 'Matroska / WebM' },
  { bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], offset: 0, format: 'MS-CFB', description: 'Microsoft Compound File (doc/xls/ppt)' },
  { bytes: [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66], offset: 0, format: 'SQLITE3', description: 'SQLite3 Database' },
  { bytes: [0xef, 0xbb, 0xbf], offset: 0, format: 'UTF-8 BOM', description: 'UTF-8 with BOM' },
  { bytes: [0xff, 0xfe], offset: 0, format: 'UTF-16 LE', description: 'UTF-16 Little-Endian BOM' },
  { bytes: [0xfe, 0xff], offset: 0, format: 'UTF-16 BE', description: 'UTF-16 Big-Endian BOM' },
];

export function detectMagicBytes(data: Uint8Array): MagicByteMatch[] {
  const matches: MagicByteMatch[] = [];
  for (const sig of SIGNATURES) {
    const startOffset = sig.offset;
    if (data.length < startOffset + sig.bytes.length) continue;
    let match = true;
    for (let i = 0; i < sig.bytes.length; i++) {
      const expected = sig.bytes[i];
      if (expected !== null && data[startOffset + i] !== expected) {
        match = false;
        break;
      }
    }
    if (match) {
      matches.push({ format: sig.format, description: sig.description, offset: startOffset });
    }
  }
  return matches;
}

