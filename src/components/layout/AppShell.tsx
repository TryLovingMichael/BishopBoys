import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'DASHBOARD', icon: 'D' },
  { path: '/hex', label: 'HEX EDITOR', icon: 'H' },
  { path: '/cases', label: 'CASE MANAGER', icon: 'C' },
];

export default function AppShell() {
  const { setAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.root}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoMark}>BB</div>
          <div>
            <div style={styles.logoTitle}>BISHOPBOYS</div>
            <div style={styles.logoSub}>v1.0.0</div>
          </div>
        </div>

        <div style={styles.navDivider} />

        <nav style={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? 'var(--bg-selected)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.navDivider} />
          <button onClick={handleLogout} style={styles.logoutBtn}>
            SIGN OUT
          </button>
          <div style={styles.sidebarMeta}>
            SYSTEM ACTIVE
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: 'var(--bg-primary)',
    overflow: 'hidden',
  },
  sidebar: {
    width: 200,
    flexShrink: 0,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sidebarHeader: {
    padding: '18px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 34,
    height: 34,
    background: 'var(--accent-blue-dim)',
    border: '1px solid var(--accent-blue)',
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 800,
    color: 'var(--accent-blue)',
    flexShrink: 0,
  },
  logoTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-primary)',
  },
  logoSub: {
    fontSize: 9,
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  navDivider: {
    height: 1,
    background: 'var(--border-subtle)',
    margin: '0 0',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
    gap: 1,
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 16px',
    textDecoration: 'none',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    transition: 'all 0.1s',
    cursor: 'pointer',
  },
  navIcon: {
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    background: 'var(--bg-header)',
    border: '1px solid var(--border-color)',
    borderRadius: 2,
    flexShrink: 0,
  },
  navLabel: {
    flex: 1,
  },
  sidebarFooter: {
    padding: '8px 0 12px',
  },
  logoutBtn: {
    display: 'block',
    width: 'calc(100% - 24px)',
    margin: '10px 12px 6px',
    padding: '7px 12px',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: 2,
    transition: 'all 0.15s',
  },
  sidebarMeta: {
    textAlign: 'center',
    fontSize: 8,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  main: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};

