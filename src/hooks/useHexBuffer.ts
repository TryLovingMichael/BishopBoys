import { useState, useCallback } from 'react';
import type { HexBuffer, Selection } from '../types/hex';

export function useHexBuffer() {
  const [buffer, setBuffer] = useState<HexBuffer | null>(null);
  const [selection, setSelection] = useState<Selection>({ offset: 0, length: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((file: File) => {
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        const data = new Uint8Array(result);
        setBuffer({ data, filename: file.name, size: file.size });
        setSelection({ offset: 0, length: 1 });
      }
      setLoading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const selectOffset = useCallback((offset: number, length = 1) => {
    setSelection({ offset, length });
  }, []);

  return { buffer, selection, loading, error, loadFile, selectOffset };
}

