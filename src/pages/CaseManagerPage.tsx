import React, { useState } from 'react';
import { useCaseStore } from '../store/caseStore';
import CaseList from '../components/cases/CaseList';
import CaseForm from '../components/cases/CaseForm';
import CaseExportImport from '../components/cases/CaseExportImport';
import type { Case } from '../types/cases';
import { getStatusClass } from '../utils/caseUtils';

type ViewMode = 'list' | 'new' | 'edit';

export default function CaseManagerPage() {
  const { cases, deleteCase } = useCaseStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const selectedCase = cases.find(c => c.id === selectedId) ?? null;

  const handleNew = () => {
    setSelectedId(null);
    setViewMode('new');
  };

  const handleEdit = () => {
    if (selectedCase) setViewMode('edit');
  };

  const handleClose = () => {
    setViewMode('list');
  };

  const handleDelete = () => {
    if (!selectedCase) return;
    if (window.confirm(`Delete case "${selectedCase.caseNumber} - ${selectedCase.title}"? This cannot be undone.`)) {
      deleteCase(selectedCase.id);
      setSelectedId(null);
      setViewMode('list');
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setViewMode('list');
  };

  const isFormMode = viewMode === 'new' || viewMode === 'edit';

  return (
    <div style={styles.root}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <span style={styles.toolbarTitle}>CASE MANAGER</span>
          <span style={styles.toolbarCount}>{cases.length} CASE{cases.length !== 1 ? 'S' : ''}</span>
        </div>
        <div style={styles.toolbarRight}>
          <CaseExportImport />
          <div style={styles.toolbarSep} />
          <button className="btn-primary" onClick={handleNew}>+ NEW CASE</button>
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.listPanel}>
          <div className="panel-header">CASES</div>
          <CaseList cases={cases} selectedId={selectedId} onSelect={handleSelect} />
        </div>

        <div style={styles.detailPanel}>
          {isFormMode ? (
            <CaseForm
              existingCase={viewMode === 'edit' ? selectedCase : null}
              onClose={handleClose}
            />
          ) : selectedCase ? (
            <CaseDetail
              case_={selectedCase}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div style={styles.emptyDetail}>
              <div style={styles.emptyTitle}>SELECT A CASE</div>
              <div style={styles.emptySub}>Choose a case from the list or create a new one</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseDetail({ case_: c, onEdit, onDelete }: { case_: Case; onEdit: () => void; onDelete: () => void }) {
  return (
    <div style={styles.detail}>
      <div style={styles.detailHeader}>
        <div style={styles.detailMeta}>
          <span style={styles.detailCaseNum}>{c.caseNumber}</span>
          <span className={`tag ${getStatusClass(c.status)}`}>{c.status}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-secondary" onClick={onEdit}>EDIT</button>
          <button className="btn-danger" onClick={onDelete}>DELETE</button>
        </div>
      </div>

      <div style={styles.detailBody}>
        <div style={styles.detailTitle}>{c.title}</div>

        <div style={styles.detailInfo}>
          {c.subcategory && (
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>SUBCATEGORY</span>
              <span style={styles.infoValue}>{c.subcategory}</span>
            </div>
          )}
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>CREATED</span>
            <span style={styles.infoValue}>{new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>MODIFIED</span>
            <span style={styles.infoValue}>{new Date(c.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        {c.tags.length > 0 && (
          <div style={styles.tagRow}>
            {c.tags.map(t => (
              <span key={t} style={styles.tagChip}>{t}</span>
            ))}
          </div>
        )}

        <div style={styles.divider} />

        <div style={styles.notesHeader}>
          NOTES <span style={styles.notesCount}>({c.notes.length})</span>
        </div>

        {c.notes.length === 0 ? (
          <div style={styles.noNotes}>No notes for this case. Edit to add notes.</div>
        ) : (
          <div style={styles.notesList}>
            {c.notes.map(note => (
              <div key={note.id} style={styles.noteItem}>
                <div style={styles.noteItemHeader}>
                  <span style={styles.noteItemTitle}>{note.title}</span>
                  {note.subcategory && <span style={styles.noteItemSub}>{note.subcategory}</span>}
                </div>
                {note.content && (
                  <div style={styles.noteItemContent}>{note.content}</div>
                )}
                <div style={styles.noteItemMeta}>{new Date(note.updatedAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
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
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 14px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
    gap: 12,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  toolbarTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-secondary)',
  },
  toolbarCount: {
    fontSize: 9,
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    padding: '1px 6px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 2,
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  toolbarSep: {
    width: 1,
    height: 16,
    background: 'var(--border-color)',
  },
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  listPanel: {
    width: 280,
    flexShrink: 0,
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'var(--bg-panel)',
  },
  detailPanel: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  emptyDetail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
  },
  emptySub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    opacity: 0.7,
    letterSpacing: '0.03em',
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  detailMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  detailCaseNum: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--accent-blue)',
    letterSpacing: '0.06em',
  },
  detailBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: 'var(--text-primary)',
    letterSpacing: '0.02em',
    lineHeight: 1.3,
  },
  detailInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    padding: '10px 12px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 3,
  },
  infoRow: {
    display: 'flex',
    gap: 12,
  },
  infoLabel: {
    width: 90,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },
  tagChip: {
    fontSize: 10,
    padding: '2px 8px',
    background: '#1a2a4a',
    border: '1px solid var(--accent-blue-dim)',
    borderRadius: 2,
    color: 'var(--accent-blue)',
    letterSpacing: '0.04em',
  },
  divider: {
    height: 1,
    background: 'var(--border-color)',
  },
  notesHeader: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  notesCount: {
    color: 'var(--text-muted)',
    fontWeight: 400,
  },
  noNotes: {
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.03em',
    fontStyle: 'italic',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  noteItem: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 3,
    padding: '10px 12px',
  },
  noteItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  noteItemTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary)',
    flex: 1,
  },
  noteItemSub: {
    fontSize: 9,
    padding: '1px 6px',
    background: 'var(--bg-header)',
    border: '1px solid var(--border-color)',
    borderRadius: 2,
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
  },
  noteItemContent: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginBottom: 8,
  },
  noteItemMeta: {
    fontSize: 9,
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
};

