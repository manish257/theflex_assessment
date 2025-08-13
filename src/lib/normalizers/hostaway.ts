import { HostawayReviewRaw, NormalizedReview, ReviewType } from '../types';
import { listingKeyFrom, safeNumber, toIsoString } from '../utils';

function normalizeType(input?: string | null): ReviewType {
  if (!input) return 'unknown';
  const v = input.toLowerCase();
  if (v.includes('guest-to-host')) return 'guest-to-host';
  if (v.includes('host-to-guest')) return 'host-to-guest';
  return 'unknown';
}

export function normalizeHostawayReview(r: HostawayReviewRaw): NormalizedReview {
  const overall = safeNumber(r.rating);
  const submittedIso = toIsoString(r.submittedAt || undefined);
  const listingId = r.listingId != null ? String(r.listingId) : null;
  const listingName = r.listingName || 'Unknown Listing';
  const id = `hostaway:${r.id}`;
  return {
    id,
    listingId,
    listingName,
    channel: 'hostaway',
    type: normalizeType(r.type),
    overallRating: overall,
    categories: (r.reviewCategory || []).map(c => ({ category: c.category, rating: safeNumber(c.rating) })),
    text: r.publicReview || '',
    authorName: r.guestName || null,
    submittedAt: submittedIso,
    raw: r,
  };
}

export function listingKeyForHostaway(r: HostawayReviewRaw): string {
  const listingId = r.listingId != null ? String(r.listingId) : null;
  return listingKeyFrom(listingId, r.listingName || undefined);
}


