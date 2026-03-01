import React, { useRef, useState, useCallback } from 'react';
import HexEditor from '../components/hex/HexEditor';
import { useHexBuffer } from '../hooks/useHexBuffer';

export default function HexEditorPage() {
  const { buffer, selection, loading, error, loadFile, selectOffset } = useHexBuffer();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    loadFile(file);
  }, [loadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  if (buffer) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={styles.toolbar}>
          <button
            className="btn-secondary"
            onClick={() => inputRef.current?.click()}
          >
            OPEN FILE
          </button>
          <span style={styles.toolbarSep}>|</span>
          <span style={styles.toolbarInfo}>HEX EDITOR — READ-ONLY VIEW</span>
          <input
            ref={inputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <HexEditor buffer={buffer} selection={selection} onSelectOffset={selectOffset} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dropRoot}>
      <div
        style={{
          ...styles.dropZone,
          borderColor: isDragging ? 'var(--accent-blue)' : 'var(--border-color)',
          background: isDragging ? 'var(--bg-highlight)' : 'var(--bg-panel)',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {loading ? (
          <div style={styles.dropContent}>
            <div style={styles.dropTitle}>LOADING FILE...</div>
          </div>
        ) : (
          <div style={styles.dropContent}>
            <div style={styles.dropIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <div style={styles.dropTitle}>DROP FILE TO INSPECT</div>
            <div style={styles.dropSub}>Any file format — binary, image, executable, archive</div>
            {error && <div style={styles.dropError}>{error}</div>}
            <button
              className="btn-primary"
              style={{ marginTop: 20 }}
              onClick={() => inputRef.current?.click()}
            >
              BROWSE FILE
            </button>
            <input
              ref={inputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 14px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  toolbarSep: {
    color: 'var(--text-muted)',
    fontSize: 12,
  },
  toolbarInfo: {
    fontSize: 10,
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
  },
  dropRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 40,
    background: 'var(--bg-primary)',
  },
  dropZone: {
    maxWidth: 520,
    width: '100%',
    padding: '60px 40px',
    border: '1px dashed',
    borderRadius: 4,
    transition: 'all 0.15s',
    cursor: 'pointer',
  },
  dropContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  dropIcon: {
    marginBottom: 8,
    opacity: 0.5,
  },
  dropTitle: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-secondary)',
  },
  dropSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.03em',
    textAlign: 'center',
  },
  dropError: {
    fontSize: 11,
    color: 'var(--text-error)',
    marginTop: 8,
    padding: '6px 12px',
    background: '#2a1010',
    border: '1px solid #4a2020',
    borderRadius: 3,
  },
};

