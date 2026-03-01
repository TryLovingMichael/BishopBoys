import React, { useMemo } from 'react';
import type { InspectorResult } from '../../types/hex';
import { inspectBytes, formatFloat } from '../../utils/dataInspector';
import type { Selection } from '../../types/hex';
import ColorBar from './ColorBar';

interface DataInspectorProps {
  data: Uint8Array;
  selection: Selection;
}

interface Row {
  label: string;
  value: string | null;
  mono?: boolean;
}

function InspectorRow({ label, value, mono }: Row) {
  if (value === null) return null;
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={{ ...styles.rowValue, fontFamily: mono === false ? 'inherit' : undefined }}>
        {value}
      </span>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <div style={styles.sectionHeader}>{title}</div>;
}

export default function DataInspector({ data, selection }: DataInspectorProps) {
  const result: InspectorResult = useMemo(
    () => inspectBytes(data, selection.offset, Math.max(selection.length, 8)),
    [data, selection.offset, selection.length]
  );

  const fmt = (v: number | null): string => {
    if (v === null) return '--';
    return v.toString();
  };

  return (
    <div style={styles.root}>
      <div className="panel-header">DATA INSPECTOR</div>
      <div style={styles.scroll}>
        <SectionHeader title="BINARY" />
        <InspectorRow label="Binary" value={result.binary} />
        <InspectorRow label="Hex" value={result.hex} />

        <SectionHeader title="INTEGER" />
        <InspectorRow label="UInt8" value={fmt(result.uint8)} />
        <InspectorRow label="Int8" value={fmt(result.int8)} />
        <InspectorRow label="UInt16 LE" value={fmt(result.uint16le)} />
        <InspectorRow label="Int16 LE" value={fmt(result.int16le)} />
        <InspectorRow label="UInt16 BE" value={fmt(result.uint16be)} />
        <InspectorRow label="Int16 BE" value={fmt(result.int16be)} />
        <InspectorRow label="UInt24 LE" value={fmt(result.uint24le)} />
        <InspectorRow label="UInt24 BE" value={fmt(result.uint24be)} />
        <InspectorRow label="UInt32 LE" value={fmt(result.uint32le)} />
        <InspectorRow label="Int32 LE" value={fmt(result.int32le)} />
        <InspectorRow label="UInt32 BE" value={fmt(result.uint32be)} />
        <InspectorRow label="Int32 BE" value={fmt(result.int32be)} />

        <SectionHeader title="FLOAT" />
        <InspectorRow label="Float32 LE" value={formatFloat(result.float32le)} />
        <InspectorRow label="Float32 BE" value={formatFloat(result.float32be)} />
        <InspectorRow label="Float64 LE" value={formatFloat(result.float64le)} />
        <InspectorRow label="Float64 BE" value={formatFloat(result.float64be)} />

        <SectionHeader title="STRING" />
        <InspectorRow label="ASCII" value={result.ascii} />
        <InspectorRow label="UTF-8" value={result.utf8} mono={false} />

        <ColorBar rgb={result.rgb} rgba={result.rgba} rgb565={result.rgb565} />
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
    background: 'var(--bg-panel)',
    borderLeft: '1px solid var(--border-color)',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  sectionHeader: {
    padding: '5px 12px 3px',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-subtle)',
    borderBottom: '1px solid var(--border-subtle)',
    marginTop: 2,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '3px 12px',
    borderBottom: '1px solid var(--border-subtle)',
    minHeight: 22,
  },
  rowLabel: {
    width: 80,
    fontSize: 10,
    color: 'var(--text-muted)',
    flexShrink: 0,
    letterSpacing: '0.02em',
  },
  rowValue: {
    flex: 1,
    fontSize: 11,
    color: 'var(--text-primary)',
    letterSpacing: '0.03em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

