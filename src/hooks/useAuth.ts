import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { isAuthenticated, setAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      try {
        const res = await fetch('/api/verify', { method: 'GET', credentials: 'include' });
        if (!cancelled) setAuthenticated(res.ok);
      } catch {
        if (!cancelled) setAuthenticated(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    verify();
    return () => { cancelled = true; };
  // Run only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isAuthenticated, checking };
}

