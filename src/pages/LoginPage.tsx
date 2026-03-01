import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        navigate('/dashboard', { replace: true });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logoMark}>BB</div>
          <div>
            <div style={styles.title}>BISHOPBOYS</div>
            <div style={styles.subtitle}>SECURE OPERATIONS DASHBOARD</div>
          </div>
        </div>

        <div style={styles.dividerLine} />

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>ACCESS CREDENTIAL</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            style={styles.input}
            autoFocus
            autoComplete="current-password"
          />

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              ...styles.button,
              opacity: loading || !password ? 0.5 : 1,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>UNAUTHORIZED ACCESS IS PROHIBITED</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    background: 'var(--bg-primary)',
    backgroundImage: 'radial-gradient(ellipse at 50% 40%, #0d1525 0%, var(--bg-primary) 70%)',
  },
  container: {
    width: 380,
    padding: '36px 40px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-color)',
    borderRadius: 4,
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  logoMark: {
    width: 44,
    height: 44,
    background: 'var(--accent-blue-dim)',
    border: '1px solid var(--accent-blue)',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 16,
    letterSpacing: '0.05em',
    color: 'var(--accent-blue)',
    flexShrink: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: 9,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  dividerLine: {
    height: 1,
    background: 'var(--border-color)',
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'var(--text-secondary)',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 3,
    color: 'var(--text-primary)',
    fontSize: 13,
    fontFamily: 'inherit',
    letterSpacing: '0.05em',
  },
  error: {
    fontSize: 11,
    color: 'var(--text-error)',
    padding: '8px 10px',
    background: '#2a1010',
    border: '1px solid #4a2020',
    borderRadius: 3,
    letterSpacing: '0.02em',
  },
  button: {
    width: '100%',
    padding: '10px',
    background: 'var(--accent-blue-dim)',
    border: '1px solid var(--accent-blue)',
    borderRadius: 3,
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    marginTop: 8,
    transition: 'background 0.15s',
  },
  footer: {
    marginTop: 28,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 9,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
  },
};

