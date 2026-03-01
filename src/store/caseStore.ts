import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Case, CaseStatus, Note } from '../types/cases';
import { generateId, now } from '../utils/caseUtils';

interface CaseStore {
  cases: Case[];
  addCase: (caseNumber: string, title: string) => Case;
  updateCase: (id: string, updates: Partial<Omit<Case, 'id' | 'createdAt'>>) => void;
  deleteCase: (id: string) => void;
  addNote: (caseId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (caseId: string, noteId: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (caseId: string, noteId: string) => void;
  importCases: (cases: Case[]) => void;
  clearAll: () => void;
}

export const useCaseStore = create<CaseStore>()(
  persist(
    (set) => ({
      cases: [],
      addCase: (caseNumber, title) => {
        const newCase: Case = {
          id: generateId(),
          caseNumber,
          title,
          status: 'Active' as CaseStatus,
          subcategory: '',
          tags: [],
          notes: [],
          createdAt: now(),
          updatedAt: now(),
        };
        set(state => ({ cases: [...state.cases, newCase] }));
        return newCase;
      },
      updateCase: (id, updates) => {
        set(state => ({
          cases: state.cases.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: now() } : c
          ),
        }));
      },
      deleteCase: (id) => {
        set(state => ({ cases: state.cases.filter(c => c.id !== id) }));
      },
      addNote: (caseId, noteData) => {
        const note: Note = {
          id: generateId(),
          ...noteData,
          createdAt: now(),
          updatedAt: now(),
        };
        set(state => ({
          cases: state.cases.map(c =>
            c.id === caseId
              ? { ...c, notes: [...c.notes, note], updatedAt: now() }
              : c
          ),
        }));
      },
      updateNote: (caseId, noteId, updates) => {
        set(state => ({
          cases: state.cases.map(c =>
            c.id === caseId
              ? {
                  ...c,
                  updatedAt: now(),
                  notes: c.notes.map(n =>
                    n.id === noteId ? { ...n, ...updates, updatedAt: now() } : n
                  ),
                }
              : c
          ),
        }));
      },
      deleteNote: (caseId, noteId) => {
        set(state => ({
          cases: state.cases.map(c =>
            c.id === caseId
              ? { ...c, notes: c.notes.filter(n => n.id !== noteId), updatedAt: now() }
              : c
          ),
        }));
      },
      importCases: (cases) => {
        set(state => {
          const existingIds = new Set(state.cases.map(c => c.id));
          const newCases = cases.filter(c => !existingIds.has(c.id));
          return { cases: [...state.cases, ...newCases] };
        });
      },
      clearAll: () => set({ cases: [] }),
    }),
    {
      name: 'bishopboys-cases',
    }
  )
);

