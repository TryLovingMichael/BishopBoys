import type { Case } from '../types/cases';
import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function now(): string {
  return new Date().toISOString();
}

export function exportCasesToJson(cases: Case[]): string {
  return JSON.stringify({ exportedAt: now(), version: '1.0', cases }, null, 2);
}

export function downloadJson(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseCasesJson(json: string): Case[] {
  const parsed = JSON.parse(json);
  if (Array.isArray(parsed)) return parsed;
  if (parsed.cases && Array.isArray(parsed.cases)) return parsed.cases;
  throw new Error('Invalid cases JSON format');
}

export const STATUS_OPTIONS = ['Active', 'Pending', 'Review', 'Closed'] as const;

export function getStatusClass(status: string): string {
  switch (status) {
    case 'Active': return 'tag-active';
    case 'Pending': return 'tag-pending';
    case 'Review': return 'tag-review';
    case 'Closed': return 'tag-closed';
    default: return 'tag-closed';
  }
}

export function getStatusDotClass(status: string): string {
  switch (status) {
    case 'Active': return 'status-dot-active';
    case 'Pending': return 'status-dot-pending';
    case 'Review': return 'status-dot-review';
    case 'Closed': return 'status-dot-closed';
    default: return 'status-dot-closed';
  }
}

