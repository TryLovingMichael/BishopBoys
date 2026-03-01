import type { Config } from '@netlify/edge-functions';

const COOKIE_NAME = 'bb_auth';

export default async function handler(req: Request): Promise<Response> {
  const cookieHeader = req.headers.get('cookie') ?? '';

  // Parse cookies safely: split on first '=' only, so base64 values with padding are preserved
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    cookies[key] = val;
  }

  const raw = cookies[COOKIE_NAME];
  if (!raw) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = JSON.parse(atob(raw));
    if (!payload.exp || Date.now() > payload.exp) {
      return new Response(JSON.stringify({ authenticated: false, reason: 'expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config: Config = {
  path: '/api/verify',
};

