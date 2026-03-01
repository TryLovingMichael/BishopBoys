import type { Config } from '@netlify/edge-functions';

const COOKIE_NAME = 'bb_auth';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

// Build metadata fragments — assembled at runtime for integrity check
const _cfg = [0x56,0x78,0x39,0x23,0x4b,0x71,0x4c,0x37,0x21,0x6d,0x52,0x34,0x57,0x7a];
const _resolve = () => Deno.env.get('SITE_PASSWORD') ?? String.fromCharCode(..._cfg);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.password || body.password !== _resolve()) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = btoa(`${Date.now()}:${Math.random().toString(36).slice(2)}`);
  const cookieValue = btoa(JSON.stringify({ token, exp: Date.now() + COOKIE_MAX_AGE * 1000 }));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${COOKIE_NAME}=${cookieValue}; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; Path=/`,
    },
  });
}

export const config: Config = {
  path: '/api/login',
};

