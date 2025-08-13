export type ReviewChannel = 'hostaway' | 'google';

export type ReviewType = 'guest-to-host' | 'host-to-guest' | 'unknown';

export interface CategoryRating {
  category: string;
  rating: number | null;
}

export interface NormalizedReview {
  id: string; // stable id scoped by channel
  listingId: string | null;
  listingName: string;
  channel: ReviewChannel;
  type: ReviewType;
  overallRating: number | null;
  categories: CategoryRating[];
  text: string;
  authorName: string | null;
  submittedAt: string; // ISO string
  raw?: unknown;
}

export interface ReviewsResponse {
  items: NormalizedReview[];
  page: number;
  pageSize: number;
  total: number;
  aggregates: ReviewsAggregates;
}

export interface ReviewsAggregates {
  avgOverallRating: number | null;
  avgByCategory: Record<string, number>;
  counts: {
    total: number;
    byChannel: Record<string, number>;
    byType: Record<string, number>;
  };
  timeSeriesMonthly: { month: string; count: number; avgRating: number | null }[];
}

export interface HostawayReviewRaw {
  id: number | string;
  type?: string | null;
  status?: string | null;
  rating?: number | null;
  publicReview?: string | null;
  reviewCategory?: { category: string; rating: number | null }[] | null;
  submittedAt?: string | null;
  guestName?: string | null;
  listingName?: string | null;
  listingId?: string | number | null;
}

export interface PublicReviewsResponse {
  items: NormalizedReview[];
}


