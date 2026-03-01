import React from 'react';

interface ColorBarProps {
  rgb: { r: number; g: number; b: number } | null;
  rgba: { r: number; g: number; b: number; a: number } | null;
  rgb565: { r: number; g: number; b: number } | null;
}

function hexColor(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function ColorSwatch({ label, r, g, b, alpha }: { label: string; r: number; g: number; b: number; alpha?: number }) {
  const hex = hexColor(r, g, b);
  const bg = alpha !== undefined ? `rgba(${r},${g},${b},${alpha / 255})` : `rgb(${r},${g},${b})`;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.5 ? '#000' : '#fff';

  return (
    <div style={styles.swatchRow}>
      <span style={styles.swatchLabel}>{label}</span>
      <div style={{ ...styles.swatchBlock, background: bg }}>
        <span style={{ color: textColor, fontSize: 9, fontWeight: 600, letterSpacing: '0.05em' }}>{hex}</span>
      </div>
      <span style={styles.swatchValues}>
        R:{r} G:{g} B:{b}{alpha !== undefined ? ` A:${alpha}` : ''}
      </span>
    </div>
  );
}

export default function ColorBar({ rgb, rgba, rgb565 }: ColorBarProps) {
  if (!rgb && !rgba && !rgb565) return null;

  return (
    <div style={styles.root}>
      <div className="panel-header">COLOR PREVIEW</div>
      <div style={styles.body}>
        {rgb && <ColorSwatch label="RGB" r={rgb.r} g={rgb.g} b={rgb.b} />}
        {rgba && <ColorSwatch label="RGBA" r={rgba.r} g={rgba.g} b={rgba.b} alpha={rgba.a} />}
        {rgb565 && <ColorSwatch label="RGB565" r={rgb565.r} g={rgb565.g} b={rgb565.b} />}
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
    gap: 6,
  },
  swatchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  swatchLabel: {
    width: 48,
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
    flexShrink: 0,
  },
  swatchBlock: {
    height: 20,
    width: 80,
    borderRadius: 2,
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  swatchValues: {
    fontSize: 10,
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  },
};

