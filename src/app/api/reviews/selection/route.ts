import { NextRequest } from 'next/server';
import { approvedKey, getKV } from '@/lib/kv';

export async function POST(req: NextRequest) {
  const { listingKey, reviewId, approved } = await req.json();
  if (!listingKey || !reviewId || typeof approved !== 'boolean') {
    return new Response(JSON.stringify({ error: 'Invalid body' }), { status: 400 });
  }
  const kv = getKV();
  const key = approvedKey(listingKey);
  if (approved) {
    await kv.sadd(key, reviewId);
  } else {
    await kv.srem(key, reviewId);
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}


