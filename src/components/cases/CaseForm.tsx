import React, { useState } from 'react';
import type { Case, CaseStatus, Note } from '../../types/cases';
import { useCaseStore } from '../../store/caseStore';
import { STATUS_OPTIONS } from '../../utils/caseUtils';
import { generateId, now } from '../../utils/caseUtils';

interface CaseFormProps {
  existingCase?: Case | null;
  onClose: () => void;
}

const EMPTY_NOTE = { title: '', content: '', subcategory: '', tags: [] as string[] };

export default function CaseForm({ existingCase, onClose }: CaseFormProps) {
  const { addCase, updateCase, addNote, updateNote, deleteNote } = useCaseStore();

  const [caseNumber, setCaseNumber] = useState(existingCase?.caseNumber ?? '');
  const [title, setTitle] = useState(existingCase?.title ?? '');
  const [status, setStatus] = useState<CaseStatus>(existingCase?.status ?? 'Active');
  const [subcategory, setSubcategory] = useState(existingCase?.subcategory ?? '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(existingCase?.tags ?? []);
  const [notes, setNotes] = useState<Note[]>(existingCase?.notes ?? []);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState(EMPTY_NOTE);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!caseNumber.trim()) e.caseNumber = 'Case number is required';
    if (!title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (existingCase) {
      updateCase(existingCase.id, { caseNumber, title, status, subcategory, tags });
    } else {
      const newCase = addCase(caseNumber, title);
      updateCase(newCase.id, { status, subcategory, tags });
    }
    onClose();
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

  const openNoteForm = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({ title: note.title, content: note.content, subcategory: note.subcategory, tags: note.tags });
    } else {
      setEditingNote(null);
      setNoteForm(EMPTY_NOTE);
    }
    setShowNoteForm(true);
  };

  const saveNote = () => {
    if (!noteForm.title.trim()) return;
    if (existingCase) {
      if (editingNote) {
        updateNote(existingCase.id, editingNote.id, noteForm);
        setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...noteForm, updatedAt: now() } : n));
      } else {
        addNote(existingCase.id, noteForm);
        const newNote: Note = { id: generateId(), ...noteForm, createdAt: now(), updatedAt: now() };
        setNotes(prev => [...prev, newNote]);
      }
    } else {
      if (editingNote) {
        setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...noteForm, updatedAt: now() } : n));
      } else {
        setNotes(prev => [...prev, { id: generateId(), ...noteForm, createdAt: now(), updatedAt: now() }]);
      }
    }
    setShowNoteForm(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    if (existingCase) deleteNote(existingCase.id, noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>{existingCase ? 'EDIT CASE' : 'NEW CASE'}</span>
        <button className="btn-secondary" onClick={onClose}>CANCEL</button>
      </div>

      <div style={styles.body}>
        <div style={styles.grid}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>CASE NUMBER {errors.caseNumber && <span style={styles.errInline}>{errors.caseNumber}</span>}</label>
            <input value={caseNumber} onChange={e => setCaseNumber(e.target.value)} placeholder="e.g. BB-2026-001" style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>STATUS</label>
            <select value={status} onChange={e => setStatus(e.target.value as CaseStatus)} style={styles.input}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>TITLE {errors.title && <span style={styles.errInline}>{errors.title}</span>}</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Case title or description" style={styles.input} />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>SUBCATEGORY</label>
          <input value={subcategory} onChange={e => setSubcategory(e.target.value)} placeholder="e.g. Fraud, Cyber, Physical" style={styles.input} />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>TAGS</label>
          <div style={styles.tagInputRow}>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
              placeholder="Add tag, press Enter"
              style={{ ...styles.input, flex: 1 }}
            />
            <button className="btn-secondary" onClick={addTag}>ADD</button>
          </div>
          {tags.length > 0 && (
            <div style={styles.tagList}>
              {tags.map(t => (
                <span key={t} style={styles.tagChip}>
                  {t}
                  <button onClick={() => removeTag(t)} style={styles.tagRemove}>x</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={styles.notesSection}>
          <div style={styles.notesSectionHeader}>
            <span style={styles.label}>NOTES ({notes.length})</span>
            <button className="btn-secondary" onClick={() => openNoteForm()}>+ ADD NOTE</button>
          </div>

          {showNoteForm && (
            <div style={styles.noteForm}>
              <div style={styles.grid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>NOTE TITLE</label>
                  <input
                    value={noteForm.title}
                    onChange={e => setNoteForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Note title"
                    style={styles.input}
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>SUBCATEGORY</label>
                  <input
                    value={noteForm.subcategory}
                    onChange={e => setNoteForm(p => ({ ...p, subcategory: e.target.value }))}
                    placeholder="e.g. Evidence, Timeline"
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>CONTENT</label>
                <textarea
                  value={noteForm.content}
                  onChange={e => setNoteForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Note content..."
                  rows={5}
                  style={{ ...styles.input, resize: 'vertical', width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={saveNote}>SAVE NOTE</button>
                <button className="btn-secondary" onClick={() => setShowNoteForm(false)}>CANCEL</button>
              </div>
            </div>
          )}

          <div style={styles.noteList}>
            {notes.map(note => (
              <div key={note.id} style={styles.noteItem}>
                <div style={styles.noteHeader}>
                  <span style={styles.noteTitle}>{note.title}</span>
                  {note.subcategory && <span style={styles.noteSub}>{note.subcategory}</span>}
                  <div style={styles.noteActions}>
                    <button className="btn-secondary" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => openNoteForm(note)}>EDIT</button>
                    <button className="btn-danger" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => handleDeleteNote(note.id)}>DEL</button>
                  </div>
                </div>
                {note.content && (
                  <div style={styles.noteContent}>{note.content}</div>
                )}
                <div style={styles.noteMeta}>
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button className="btn-primary" onClick={handleSave}>
          {existingCase ? 'SAVE CHANGES' : 'CREATE CASE'}
        </button>
        <button className="btn-secondary" onClick={onClose}>CANCEL</button>
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-secondary)',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  footer: {
    display: 'flex',
    gap: 8,
    padding: '12px 16px',
    background: 'var(--bg-header)',
    borderTop: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  errInline: {
    color: 'var(--text-error)',
    fontWeight: 400,
    letterSpacing: '0.02em',
    fontSize: 9,
  },
  input: {
    width: '100%',
    padding: '7px 10px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 3,
    color: 'var(--text-primary)',
    fontSize: 12,
    fontFamily: 'inherit',
  },
  tagInputRow: {
    display: 'flex',
    gap: 6,
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
  },
  tagChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '2px 8px',
    background: '#1a2a4a',
    border: '1px solid var(--accent-blue-dim)',
    borderRadius: 2,
    fontSize: 10,
    color: 'var(--accent-blue)',
    letterSpacing: '0.04em',
  },
  tagRemove: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: 10,
    padding: 0,
    lineHeight: 1,
    fontWeight: 700,
  },
  notesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  notesSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noteForm: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 3,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  noteList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  noteItem: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 3,
    padding: 10,
  },
  noteHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary)',
    flex: 1,
    letterSpacing: '0.02em',
  },
  noteSub: {
    fontSize: 9,
    padding: '1px 6px',
    background: '#1a2a3a',
    border: '1px solid var(--border-color)',
    borderRadius: 2,
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
  },
  noteActions: {
    display: 'flex',
    gap: 4,
    marginLeft: 'auto',
  },
  noteContent: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginBottom: 6,
  },
  noteMeta: {
    fontSize: 9,
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
};

