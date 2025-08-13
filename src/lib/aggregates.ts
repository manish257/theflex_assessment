import { NormalizedReview, ReviewsAggregates } from './types';
import { monthKey } from './utils';

export function computeAggregates(items: NormalizedReview[]): ReviewsAggregates {
  if (items.length === 0) {
    return {
      avgOverallRating: null,
      avgByCategory: {},
      counts: { total: 0, byChannel: {}, byType: {} },
      timeSeriesMonthly: [],
    };
  }

  const byChannel: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let ratingSum = 0;
  let ratingCount = 0;
  const categorySum: Record<string, { sum: number; n: number }> = {};
  const monthly: Record<string, { count: number; sum: number; n: number }> = {};

  for (const r of items) {
    byChannel[r.channel] = (byChannel[r.channel] ?? 0) + 1;
    byType[r.type] = (byType[r.type] ?? 0) + 1;
    if (r.overallRating != null) {
      ratingSum += r.overallRating;
      ratingCount += 1;
    }
    for (const c of r.categories) {
      if (c.rating == null) continue;
      const s = categorySum[c.category] || { sum: 0, n: 0 };
      s.sum += c.rating;
      s.n += 1;
      categorySum[c.category] = s;
    }
    const mk = monthKey(r.submittedAt);
    const ts = monthly[mk] || { count: 0, sum: 0, n: 0 };
    ts.count += 1;
    if (r.overallRating != null) {
      ts.sum += r.overallRating;
      ts.n += 1;
    }
    monthly[mk] = ts;
  }

  const avgOverallRating = ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(2)) : null;
  const avgByCategory = Object.fromEntries(
    Object.entries(categorySum).map(([k, v]) => [k, Number((v.sum / v.n).toFixed(2))])
  );
  const timeSeriesMonthly = Object.entries(monthly)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, v]) => ({ month, count: v.count, avgRating: v.n > 0 ? Number((v.sum / v.n).toFixed(2)) : null }));

  return {
    avgOverallRating,
    avgByCategory,
    counts: { total: items.length, byChannel, byType },
    timeSeriesMonthly,
  };
}


