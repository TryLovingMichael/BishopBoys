export interface HexBuffer {
  data: Uint8Array;
  filename: string;
  size: number;
}

export interface Selection {
  offset: number;
  length: number;
}

export interface InspectorResult {
  binary: string;
  hex: string;
  uint8: number;
  int8: number;
  uint16le: number | null;
  int16le: number | null;
  uint16be: number | null;
  int16be: number | null;
  uint24le: number | null;
  uint24be: number | null;
  uint32le: number | null;
  int32le: number | null;
  uint32be: number | null;
  int32be: number | null;
  float32le: number | null;
  float32be: number | null;
  float64le: number | null;
  float64be: number | null;
  ascii: string;
  utf8: string;
  rgb: { r: number; g: number; b: number } | null;
  rgba: { r: number; g: number; b: number; a: number } | null;
  rgb565: { r: number; g: number; b: number } | null;
}

export interface MagicByteMatch {
  format: string;
  description: string;
  offset: number;
}

