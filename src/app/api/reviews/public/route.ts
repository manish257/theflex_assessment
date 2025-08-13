import { NextRequest } from 'next/server';
import { getKV, approvedKey } from '@/lib/kv';
import { PublicReviewsResponse, HostawayReviewRaw } from '@/lib/types';
import { normalizeHostawayReview } from '@/lib/normalizers/hostaway';

async function loadHostaway(): Promise<HostawayReviewRaw[]> {
  try {
    const mod = await import('@/data/mock/hostaway.json');
    const data = (mod as unknown as { default?: HostawayReviewRaw[] })?.default as
      | HostawayReviewRaw[]
      | undefined;
    return data ?? ((mod as unknown as HostawayReviewRaw[]) || []);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const listingKey = req.nextUrl.searchParams.get('listingKey');
  if (!listingKey) return new Response(JSON.stringify({ error: 'listingKey required' }), { status: 400 });

  const kv = getKV();
  const approved = new Set(await kv.smembers(approvedKey(listingKey)));

  // For now serve Hostaway approved reviews. Google can be appended later.
  const hostaway = await loadHostaway();
  const normalized = hostaway.map((r) => normalizeHostawayReview(r));
  const items = normalized.filter(r => approved.has(r.id));

  const body: PublicReviewsResponse = { items };
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
}


