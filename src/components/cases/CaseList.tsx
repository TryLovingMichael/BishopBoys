import React, { useState, useMemo } from 'react';
import type { Case, CaseStatus } from '../../types/cases';
import CaseCard from './CaseCard';
import { STATUS_OPTIONS } from '../../utils/caseUtils';

interface CaseListProps {
  cases: Case[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CaseList({ cases, selectedId, onSelect }: CaseListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'number'>('updated');

  const filtered = useMemo(() => {
    let result = [...cases];
    if (statusFilter !== 'All') result = result.filter(c => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.subcategory.toLowerCase().includes(q) ||
        c.tags.some(t => t.includes(q))
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'updated') return b.updatedAt.localeCompare(a.updatedAt);
      if (sortBy === 'created') return b.createdAt.localeCompare(a.createdAt);
      return a.caseNumber.localeCompare(b.caseNumber);
    });
    return result;
  }, [cases, search, statusFilter, sortBy]);

  return (
    <div style={styles.root}>
      <div style={styles.controls}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cases..."
          style={styles.search}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as CaseStatus | 'All')}
          style={styles.select}
        >
          <option value="All">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          style={styles.select}
        >
          <option value="updated">Modified</option>
          <option value="created">Created</option>
          <option value="number">Number</option>
        </select>
      </div>

      <div style={styles.count}>
        {filtered.length} / {cases.length} CASES
      </div>

      <div style={styles.list}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            {cases.length === 0 ? 'No cases. Create the first one.' : 'No results for current filter.'}
          </div>
        ) : (
          filtered.map(c => (
            <CaseCard
              key={c.id}
              case_={c}
              isSelected={c.id === selectedId}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
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
  },
  controls: {
    display: 'flex',
    gap: 6,
    padding: '8px 10px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  search: {
    flex: 1,
    padding: '5px 8px',
    fontSize: 11,
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 3,
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    minWidth: 0,
  },
  select: {
    padding: '5px 6px',
    fontSize: 10,
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 3,
    color: 'var(--text-secondary)',
    fontFamily: 'inherit',
    flexShrink: 0,
  },
  count: {
    padding: '4px 12px',
    fontSize: 9,
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
    flexShrink: 0,
  },
  list: {
    flex: 1,
    overflowY: 'auto',
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
};

