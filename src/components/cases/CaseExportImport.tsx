import React, { useRef } from 'react';
import { useCaseStore } from '../../store/caseStore';
import { exportCasesToJson, downloadJson, parseCasesJson } from '../../utils/caseUtils';

export default function CaseExportImport() {
  const { cases, importCases, clearAll } = useCaseStore();
  const importRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportCasesToJson(cases);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadJson(json, `bishopboys-cases-${ts}.json`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const cases = parseCasesJson(ev.target?.result as string);
        importCases(cases);
      } catch (err) {
        alert('Invalid JSON file. Could not import cases.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    if (window.confirm('Delete ALL cases from local storage? This cannot be undone. Export first if needed.')) {
      clearAll();
    }
  };

  return (
    <div style={styles.root}>
      <button className="btn-secondary" onClick={handleExport} title="Export all cases to JSON">
        EXPORT JSON
      </button>
      <button className="btn-secondary" onClick={() => importRef.current?.click()} title="Import cases from JSON">
        IMPORT JSON
      </button>
      <button className="btn-danger" onClick={handleClear} title="Clear all cases from storage">
        CLEAR ALL
      </button>
      <input
        ref={importRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
};

