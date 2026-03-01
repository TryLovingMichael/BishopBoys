import React from 'react';
import HexPane from './HexPane';
import DataInspector from './DataInspector';
import MagicBytes from './MagicBytes';
import type { HexBuffer, Selection } from '../../types/hex';
import { detectMagicBytes } from '../../utils/magicBytes';
import { formatAddress, formatFileSize } from '../../utils/hexUtils';
import StatusBar from '../layout/StatusBar';

interface HexEditorProps {
  buffer: HexBuffer;
  selection: Selection;
  onSelectOffset: (offset: number) => void;
}

export default function HexEditor({ buffer, selection, onSelectOffset }: HexEditorProps) {
  const magicMatches = React.useMemo(
    () => detectMagicBytes(buffer.data),
    [buffer.data]
  );

  return (
    <div style={styles.root}>
      <div style={styles.topBar}>
        <span style={styles.filename}>{buffer.filename}</span>
        <span style={styles.filesize}>{formatFileSize(buffer.size)}</span>
        {magicMatches.length > 0 && (
          <span style={styles.formatBadge}>{magicMatches[0].format}</span>
        )}
      </div>

      <div style={styles.body}>
        <div style={styles.hexPaneWrap}>
          <MagicBytes matches={magicMatches} />
          <HexPane data={buffer.data} selection={selection} onSelectOffset={onSelectOffset} />
        </div>
        <div style={styles.inspectorWrap}>
          <DataInspector data={buffer.data} selection={selection} />
        </div>
      </div>

      <StatusBar
        left={
          <>
            <span>OFFSET: <strong style={{ color: 'var(--accent-blue)' }}>0x{formatAddress(selection.offset)}</strong></span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>DEC: {selection.offset}</span>
          </>
        }
        center={
          <span>SELECTION: {selection.length} byte{selection.length !== 1 ? 's' : ''}</span>
        }
        right={
          <span>SIZE: {formatFileSize(buffer.size)} ({buffer.size.toLocaleString()} bytes)</span>
        }
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '6px 14px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  filename: {
    fontSize: 12,
    color: 'var(--text-primary)',
    fontWeight: 600,
    letterSpacing: '0.03em',
  },
  filesize: {
    fontSize: 10,
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
  },
  formatBadge: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.08em',
    padding: '1px 7px',
    background: '#1a2a4a',
    border: '1px solid var(--accent-blue-dim)',
    color: 'var(--accent-blue)',
    borderRadius: 2,
  },
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  hexPaneWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'var(--bg-secondary)',
  },
  inspectorWrap: {
    width: 260,
    flexShrink: 0,
    overflow: 'hidden',
  },
};

