export type CaseStatus = 'Active' | 'Pending' | 'Review' | 'Closed';

export interface Tag {
  id: string;
  label: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subcategory: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  status: CaseStatus;
  subcategory: string;
  tags: string[];
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

