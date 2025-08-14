import Container from "./Container";
import ReviewCard from "@/components/ReviewCard";

type Review = {
  id: string;
  listingName: string;
  overallRating: number | null;
  categories: { category: string; rating: number | null }[];
  text: string;
  authorName: string | null;
  submittedAt: string;
};

export default function ReviewsSection({
  items,
  avg10,
  count,
}: {
  items: Review[];
  avg10: number | null;
  count: number;
}) {
  return (
    <section id="reviews" className="mt-10">
      <Container>
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center gap-3 sm:mb-5">
          <h2 className="text-xl font-semibold text-emerald-950 sm:text-2xl">
            Reviews
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-lg text-amber-500">★</span>
            {avg10 != null && (
              <span className="font-medium text-slate-900">
                {avg10.toFixed(1)}
              </span>
            )}
            <span className="text-sm text-gray-500">
              ({count} {count === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {count === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <svg
              className="mb-3 h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <p className="text-lg font-medium text-slate-900">No reviews yet</p>
            <p className="mt-1 text-sm text-gray-500">
              This property hasn’t received any guest feedback yet. Check back
              later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
            {items.map((r) => (
              <div
                key={r.id}
                className="
          rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5
          [&>div]:border-0 [&>div]:p-0 [&>div]:bg-transparent
        "
              >
                <ReviewCard review={r} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
