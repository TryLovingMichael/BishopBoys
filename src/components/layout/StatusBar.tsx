import React from 'react';

interface StatusBarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export default function StatusBar({ left, center, right }: StatusBarProps) {
  return (
    <div style={styles.bar}>
      <div style={styles.section}>{left}</div>
      <div style={{ ...styles.section, justifyContent: 'center' }}>{center}</div>
      <div style={{ ...styles.section, justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    height: 24,
    background: 'var(--accent-blue-dim)',
    borderTop: '1px solid var(--accent-blue)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    flexShrink: 0,
    gap: 16,
  },
  section: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 10,
    letterSpacing: '0.06em',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 500,
    overflow: 'hidden',
  },
};

