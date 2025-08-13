import { cookies } from 'next/headers';

export async function POST() {
  const jar = await cookies();
  jar.delete('auth');
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}


