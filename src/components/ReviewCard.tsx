"use client";
import { useState } from 'react';

type Props = {
  review: {
    id: string;
    listingName: string;
    overallRating: number | null;
    categories: { category: string; rating: number | null }[];
    text: string;
    authorName: string | null;
    submittedAt: string;
  };
};

export default function ReviewCard({ review }: Props) {
  const [expanded, setExpanded] = useState(false);
  const rating10 = review.overallRating ?? 0; // out of 10
  const stars5 = Math.max(0, Math.min(5, Math.round(rating10 / 2))); // convert to 5-star
  const text = review.text || '';
  const showMore = text.length > 220 && !expanded;
  const displayText = showMore ? text.slice(0, 220) + '…' : text;
  const date = new Date(review.submittedAt);
  const subtitle = `${review.authorName ?? 'Guest'} • ${date.toLocaleString(undefined, { month: 'long', year: 'numeric' })}`;

  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="text-amber-500" aria-label={`rating ${rating10}/10`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < stars5 ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-sm text-gray-600">{subtitle}</span>
        </div>
        <div className="text-xs text-gray-500">{(rating10 || 0).toFixed(1)}/10</div>
      </div>
      <div className="text-sm text-gray-700 mb-2">
        {displayText}
        {showMore && (
          <button className="ml-2 text-emerald-700 text-sm underline" onClick={() => setExpanded(true)}>Show more</button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {review.categories.map((c) => (
          <span key={c.category} className="text-xs bg-gray-100 rounded px-2 py-0.5">
            {c.category}: {c.rating ?? '-'}
          </span>
        ))}
      </div>
    </div>
  );
}


