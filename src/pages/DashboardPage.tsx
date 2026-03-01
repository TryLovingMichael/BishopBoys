import React from 'react';
import { useCaseStore } from '../store/caseStore';
import { useNavigate } from 'react-router-dom';
import { getStatusClass } from '../utils/caseUtils';

export default function DashboardPage() {
  const { cases } = useCaseStore();
  const navigate = useNavigate();

  const activeCases = cases.filter(c => c.status === 'Active').length;
  const pendingCases = cases.filter(c => c.status === 'Pending').length;
  const reviewCases = cases.filter(c => c.status === 'Review').length;
  const closedCases = cases.filter(c => c.status === 'Closed').length;
  const totalNotes = cases.reduce((sum, c) => sum + c.notes.length, 0);

  const recentCases = [...cases]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);

  return (
    <div style={styles.root}>
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.pageTitle}>DASHBOARD</div>
          <div style={styles.pageSubtitle}>System Overview — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.statsRow}>
          <StatCard label="TOTAL CASES" value={cases.length} color="var(--text-primary)" />
          <StatCard label="ACTIVE" value={activeCases} color="#4ec994" />
          <StatCard label="PENDING" value={pendingCases} color="#d4a843" />
          <StatCard label="UNDER REVIEW" value={reviewCases} color="#4d9eff" />
          <StatCard label="CLOSED" value={closedCases} color="#6a7a8a" />
          <StatCard label="TOTAL NOTES" value={totalNotes} color="var(--text-secondary)" />
        </div>

        <div style={styles.contentRow}>
          <div style={styles.panel}>
            <div className="panel-header">RECENT CASES</div>
            {recentCases.length === 0 ? (
              <div style={styles.emptyState}>
                No cases found. Navigate to Case Manager to create one.
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>CASE NO.</th>
                    <th style={styles.th}>TITLE</th>
                    <th style={styles.th}>STATUS</th>
                    <th style={styles.th}>NOTES</th>
                    <th style={styles.th}>MODIFIED</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map(c => (
                    <tr
                      key={c.id}
                      style={styles.tr}
                      onClick={() => navigate('/cases')}
                    >
                      <td style={{ ...styles.td, color: 'var(--accent-blue)', fontWeight: 600 }}>{c.caseNumber}</td>
                      <td style={{ ...styles.td, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                      <td style={styles.td}>
                        <span className={`tag ${getStatusClass(c.status)}`}>{c.status}</span>
                      </td>
                      <td style={{ ...styles.td, color: 'var(--text-muted)' }}>{c.notes.length}</td>
                      <td style={{ ...styles.td, color: 'var(--text-muted)' }}>{new Date(c.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={styles.sidePanel}>
            <div style={styles.panel}>
              <div className="panel-header">QUICK ACTIONS</div>
              <div style={styles.quickActions}>
                <button className="btn-primary" style={styles.actionBtn} onClick={() => navigate('/cases')}>
                  CASE MANAGER
                </button>
                <button className="btn-secondary" style={styles.actionBtn} onClick={() => navigate('/hex')}>
                  HEX EDITOR
                </button>
              </div>
            </div>

            <div style={{ ...styles.panel, marginTop: 12 }}>
              <div className="panel-header">SYSTEM INFO</div>
              <div style={styles.infoList}>
                <InfoRow label="BUILD" value="v1.0.0" />
                <InfoRow label="DEPLOYMENT" value="Netlify" />
                <InfoRow label="AUTH" value="Edge Function" />
                <InfoRow label="STORAGE" value="LocalStorage + JSON" />
                <InfoRow label="SESSION" value="HTTP-Only Cookie" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
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
  pageHeader: {
    padding: '14px 20px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: 'var(--text-primary)',
  },
  pageSubtitle: {
    fontSize: 10,
    letterSpacing: '0.04em',
    color: 'var(--text-muted)',
    marginTop: 3,
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 10,
    flexShrink: 0,
  },
  statCard: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-color)',
    borderRadius: 4,
    padding: '14px 16px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
  },
  contentRow: {
    display: 'flex',
    gap: 14,
    flex: 1,
    minHeight: 0,
  },
  panel: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-color)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sidePanel: {
    width: 220,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  emptyState: {
    padding: '24px 16px',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.03em',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '7px 12px',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    textAlign: 'left',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--bg-secondary)',
  },
  tr: {
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  td: {
    padding: '8px 12px',
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
    borderBottom: '1px solid var(--border-subtle)',
  },
  quickActions: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  actionBtn: {
    width: '100%',
    padding: '8px',
    textAlign: 'center',
  },
  infoList: {
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
  },
  infoValue: {
    fontSize: 10,
    color: 'var(--text-secondary)',
    letterSpacing: '0.03em',
  },
};

