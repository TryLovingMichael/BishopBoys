import React from 'react';
import type { Case } from '../../types/cases';
import { getStatusClass } from '../../utils/caseUtils';

interface CaseCardProps {
  case_: Case;
  isSelected: boolean;
  onClick: () => void;
}

export default function CaseCard({ case_: c, isSelected, onClick }: CaseCardProps) {
  return (
    <div
      style={{
        ...styles.card,
        background: isSelected ? 'var(--bg-selected)' : 'var(--bg-secondary)',
        borderLeft: isSelected ? '2px solid var(--accent-blue)' : '2px solid transparent',
      }}
      onClick={onClick}
    >
      <div style={styles.topRow}>
        <span style={styles.caseNum}>{c.caseNumber}</span>
        <span className={`tag ${getStatusClass(c.status)}`}>{c.status}</span>
      </div>
      <div style={styles.title}>{c.title}</div>
      <div style={styles.meta}>
        {c.subcategory && <span style={styles.sub}>{c.subcategory}</span>}
        <span style={styles.noteCount}>{c.notes.length} note{c.notes.length !== 1 ? 's' : ''}</span>
        <span style={styles.date}>{new Date(c.updatedAt).toLocaleDateString()}</span>
      </div>
      {c.tags.length > 0 && (
        <div style={styles.tags}>
          {c.tags.slice(0, 4).map(t => (
            <span key={t} style={styles.tagChip}>{t}</span>
          ))}
          {c.tags.length > 4 && <span style={styles.tagMore}>+{c.tags.length - 4}</span>}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    padding: '10px 12px',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  caseNum: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--accent-blue)',
    letterSpacing: '0.06em',
  },
  title: {
    fontSize: 12,
    color: 'var(--text-primary)',
    fontWeight: 500,
    marginBottom: 6,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sub: {
    fontSize: 9,
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
    padding: '1px 5px',
    background: 'var(--bg-header)',
    border: '1px solid var(--border-color)',
    borderRadius: 2,
  },
  noteCount: {
    fontSize: 9,
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
    flex: 1,
  },
  date: {
    fontSize: 9,
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
  },
  tagChip: {
    fontSize: 9,
    padding: '0px 5px',
    background: '#1a2235',
    border: '1px solid var(--border-color)',
    borderRadius: 2,
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
  tagMore: {
    fontSize: 9,
    color: 'var(--text-muted)',
    padding: '0px 4px',
    letterSpacing: '0.02em',
  },
};

