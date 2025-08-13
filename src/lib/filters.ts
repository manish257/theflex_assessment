import { NormalizedReview } from './types';

export interface ReviewQuery {
  listing?: string;
  channel?: string;
  type?: string;
  from?: string;
  to?: string;
  minRating?: string;
  category?: string;
  sortBy?: 'date' | 'rating';
  sortDir?: 'asc' | 'desc';
  page?: string;
  pageSize?: string;
}

export function applyFilters(all: NormalizedReview[], q: ReviewQuery): NormalizedReview[] {
  let items = all;
  if (q.listing) items = items.filter(r => r.listingId === q.listing || r.listingName === q.listing);
  if (q.channel) items = items.filter(r => r.channel === q.channel);
  if (q.type) items = items.filter(r => r.type === q.type);
  if (q.category) items = items.filter(r => r.categories.some(c => c.category === q.category));
  if (q.from) items = items.filter(r => new Date(r.submittedAt) >= new Date(q.from as string));
  if (q.to) items = items.filter(r => new Date(r.submittedAt) <= new Date(q.to as string));
  if (q.minRating) {
    const min = Number(q.minRating);
    if (Number.isFinite(min)) items = items.filter(r => (r.overallRating ?? 0) >= min);
  }
  return items;
}

export function applySort(items: NormalizedReview[], q: ReviewQuery): NormalizedReview[] {
  const by = q.sortBy || 'date';
  const dir = q.sortDir || 'desc';
  const sorted = [...items].sort((a, b) => {
    if (by === 'rating') {
      const ar = a.overallRating ?? -Infinity;
      const br = b.overallRating ?? -Infinity;
      return ar === br ? 0 : ar < br ? -1 : 1;
    }
    const at = new Date(a.submittedAt).getTime();
    const bt = new Date(b.submittedAt).getTime();
    return at === bt ? 0 : at < bt ? -1 : 1;
  });
  return dir === 'asc' ? sorted : sorted.reverse();
}

export function paginate(items: NormalizedReview[], q: ReviewQuery) {
  const page = Math.max(1, Number(q.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize || 20)));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { page, pageSize, total: items.length, slice: items.slice(start, end) };
}


