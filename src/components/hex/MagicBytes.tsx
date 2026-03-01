import React from 'react';
import type { MagicByteMatch } from '../../types/hex';

interface MagicBytesProps {
  matches: MagicByteMatch[];
}

export default function MagicBytes({ matches }: MagicBytesProps) {
  if (matches.length === 0) return null;

  return (
    <div style={styles.root}>
      <div className="panel-header">FILE SIGNATURE</div>
      <div style={styles.body}>
        {matches.map((m, i) => (
          <div key={i} style={styles.match}>
            <span style={styles.format}>{m.format}</span>
            <span style={styles.desc}>{m.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    borderTop: '1px solid var(--border-color)',
  },
  body: {
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  match: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  format: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--accent-blue)',
    letterSpacing: '0.06em',
    minWidth: 72,
    flexShrink: 0,
    background: '#1a2a4a',
    border: '1px solid var(--accent-blue-dim)',
    borderRadius: 2,
    padding: '1px 6px',
    textAlign: 'center',
  },
  desc: {
    fontSize: 10,
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  },
};

