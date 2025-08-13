import { NextRequest } from 'next/server';
import { approvedKey, getKV } from '@/lib/kv';

export async function GET(req: NextRequest) {
  const list = req.nextUrl.searchParams.get('listingKeys') || '';
  const keys = Array.from(new Set(list.split(',').map((s) => s.trim()).filter(Boolean)));
  const kv = getKV();
  const map: Record<string, string[]> = {};
  await Promise.all(
    keys.map(async (k) => {
      map[k] = await kv.smembers(approvedKey(k));
    })
  );
  return new Response(JSON.stringify({ map }), { headers: { 'content-type': 'application/json' } });
}


