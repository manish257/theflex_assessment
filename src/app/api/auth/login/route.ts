import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { password, username } = await req.json();
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!password || password !== expected) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid credentials' }), { status: 401 });
  }
  const user = typeof username === 'string' && username.length > 0 ? username : 'admin';
  const value = `Basic ${Buffer.from(`${user}:${password}`, 'utf8').toString('base64')}`;
  const jar = await cookies();
  jar.set('auth', value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 6, // 6 hours
  });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}


