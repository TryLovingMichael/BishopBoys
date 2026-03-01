import type { Config } from '@netlify/edge-functions';

const COOKIE_NAME = 'bb_auth';

export default async function handler(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`,
    },
  });
}

export const config: Config = {
  path: '/api/logout',
};

