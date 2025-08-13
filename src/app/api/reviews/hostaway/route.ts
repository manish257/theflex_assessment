import { NextRequest } from 'next/server';
import { ReviewsResponse, HostawayReviewRaw } from '@/lib/types';
import { normalizeHostawayReview } from '@/lib/normalizers/hostaway';
import { applyFilters, applySort, paginate, ReviewQuery } from '@/lib/filters';
import { computeAggregates } from '@/lib/aggregates';

async function fetchHostawaySandbox(): Promise<HostawayReviewRaw[] | null> {
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  const apiKey = process.env.HOSTAWAY_API_KEY;
  if (!accountId || !apiKey) return null;
  try {
    // The real endpoint is not used since sandbox has no reviews; keep structure for completeness
    const url = `https://api.hostaway.com/v1/reviews?accountId=${accountId}`;
    const res = await fetch(url, {
      headers: { 'Authorization': apiKey },
      // Avoid caching in edge
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: HostawayReviewRaw[] };
    const arr = Array.isArray(json?.result) ? (json.result as HostawayReviewRaw[]) : [];
    if (arr.length === 0) return null;
    return arr;
  } catch {
    return null;
  }
}

async function loadMock(): Promise<HostawayReviewRaw[]> {
  const mod = await import('@/data/mock/hostaway.json');
  const data = (mod as unknown as { default?: HostawayReviewRaw[] })?.default as
    | HostawayReviewRaw[]
    | undefined;
  return data ?? ((mod as unknown as HostawayReviewRaw[]) || []);
}

export async function GET(req: NextRequest) {
  // 1) Load data (sandbox or mock)
  const hostaway: HostawayReviewRaw[] = (await fetchHostawaySandbox()) ?? (await loadMock());
  const normalized = hostaway.map((r) => normalizeHostawayReview(r));

  // 2) Filters/sort/pagination
  const q = Object.fromEntries(req.nextUrl.searchParams.entries()) as ReviewQuery;
  const filtered = applyFilters(normalized, q);
  const sorted = applySort(filtered, q);
  const { page, pageSize, total, slice } = paginate(sorted, q);

  // 3) Aggregates
  const aggregates = computeAggregates(filtered);

  const body: ReviewsResponse = {
    items: slice,
    page,
    pageSize,
    total,
    aggregates,
  };

  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
}


