import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { BYTES_PER_ROW, formatAddress, toHex, byteToAscii, getRowCount } from '../../utils/hexUtils';
import type { Selection } from '../../types/hex';

interface HexPaneProps {
  data: Uint8Array;
  selection: Selection;
  onSelectOffset: (offset: number) => void;
}

const ROW_HEIGHT = 20;
const OVERSCAN = 8;

export default function HexPane({ data, selection, onSelectOffset }: HexPaneProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const totalRows = getRowCount(data.length);
  const totalHeight = totalRows * ROW_HEIGHT;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  }, []);

  const containerHeight = scrollRef.current?.clientHeight ?? 600;
  const visibleRowCount = Math.ceil(containerHeight / ROW_HEIGHT);
  const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endRow = Math.min(totalRows - 1, startRow + visibleRowCount + OVERSCAN * 2);

  // Scroll selected offset into view
  useEffect(() => {
    if (!scrollRef.current) return;
    const row = Math.floor(selection.offset / BYTES_PER_ROW);
    const rowTop = row * ROW_HEIGHT;
    const { scrollTop: st, clientHeight: ch } = scrollRef.current;
    if (rowTop < st) scrollRef.current.scrollTop = rowTop;
    else if (rowTop + ROW_HEIGHT > st + ch) scrollRef.current.scrollTop = rowTop - ch + ROW_HEIGHT * 2;
  }, [selection.offset]);

  const rows = useMemo(() => {
    const result = [];
    for (let r = startRow; r <= endRow; r++) {
      const rowOffset = r * BYTES_PER_ROW;
      const end = Math.min(rowOffset + BYTES_PER_ROW, data.length);
      const bytes: number[] = [];
      for (let i = rowOffset; i < end; i++) bytes.push(data[i]);
      result.push({ r, rowOffset, bytes });
    }
    return result;
  }, [data, startRow, endRow]);

  const selEnd = selection.offset + selection.length - 1;

  return (
    <div style={styles.root}>
      <div style={styles.columnHeader}>
        <span style={styles.addrCol}>OFFSET</span>
        <span style={styles.hexHeader}>
          {Array.from({ length: BYTES_PER_ROW }, (_, i) => (
            <span key={i} style={styles.hexHeaderCell}>{i.toString(16).toUpperCase().padStart(2, '0')}</span>
          ))}
        </span>
        <span style={styles.asciiHeader}>ASCII</span>
      </div>
      <div ref={scrollRef} style={styles.scroll} onScroll={handleScroll}>
        <div style={{ height: totalHeight, position: 'relative' }}>
          {rows.map(({ r, rowOffset, bytes }) => (
            <div key={r} style={{ ...styles.row, top: r * ROW_HEIGHT }}>
              <span style={styles.addr}>{formatAddress(rowOffset)}</span>
              <span style={styles.hexGroup}>
                {bytes.map((byte, i) => {
                  const off = rowOffset + i;
                  const isSelected = off >= selection.offset && off <= selEnd;
                  return (
                    <span
                      key={i}
                      style={{
                        ...styles.hexByte,
                        background: isSelected ? 'var(--selection-bg)' : 'transparent',
                        color: isSelected ? '#7eb8ff' : 'var(--text-hex)',
                        outline: isSelected ? '1px solid var(--selection-border)' : 'none',
                      }}
                      onClick={() => onSelectOffset(off)}
                    >
                      {toHex(byte)}
                    </span>
                  );
                })}
                {bytes.length < BYTES_PER_ROW &&
                  Array.from({ length: BYTES_PER_ROW - bytes.length }, (_, i) => (
                    <span key={`pad-${i}`} style={styles.hexByteEmpty}>{'  '}</span>
                  ))}
              </span>
              <span style={styles.asciiGroup}>
                {bytes.map((byte, i) => {
                  const off = rowOffset + i;
                  const isSelected = off >= selection.offset && off <= selEnd;
                  return (
                    <span
                      key={i}
                      style={{
                        ...styles.asciiByte,
                        color: isSelected ? '#7ee8b4' : 'var(--text-ascii)',
                        background: isSelected ? 'var(--selection-bg)' : 'transparent',
                      }}
                      onClick={() => onSelectOffset(off)}
                    >
                      {byteToAscii(byte)}
                    </span>
                  );
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    fontFamily: 'inherit',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 10px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
    fontSize: 10,
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    userSelect: 'none',
  },
  addrCol: {
    width: 80,
    flexShrink: 0,
    fontSize: 9,
    letterSpacing: '0.06em',
  },
  hexHeader: {
    flex: 1,
    display: 'flex',
    gap: 2,
  },
  hexHeaderCell: {
    width: 24,
    textAlign: 'center',
    fontSize: 9,
  },
  asciiHeader: {
    width: 136,
    paddingLeft: 12,
    fontSize: 9,
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ROW_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
  },
  addr: {
    width: 80,
    flexShrink: 0,
    color: 'var(--text-addr)',
    fontSize: 12,
    userSelect: 'none',
    letterSpacing: '0.03em',
  },
  hexGroup: {
    flex: 1,
    display: 'flex',
    gap: 2,
  },
  hexByte: {
    width: 24,
    textAlign: 'center',
    fontSize: 12,
    cursor: 'pointer',
    borderRadius: 1,
    letterSpacing: '0.01em',
    flexShrink: 0,
    lineHeight: `${ROW_HEIGHT}px`,
  },
  hexByteEmpty: {
    width: 24,
    display: 'inline-block',
    flexShrink: 0,
  },
  asciiGroup: {
    width: 136,
    paddingLeft: 12,
    display: 'flex',
  },
  asciiByte: {
    width: 8,
    fontSize: 12,
    cursor: 'pointer',
    textAlign: 'center',
    borderRadius: 1,
    lineHeight: `${ROW_HEIGHT}px`,
  },
};

