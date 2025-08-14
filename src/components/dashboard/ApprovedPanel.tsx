import { NormalizedReview } from "@/lib/types";

export type ApprovedPanelProps = {
  listingName?: string;
  listingKey: string | null;
  items?: NormalizedReview[];
  onUnapprove: (r: NormalizedReview) => Promise<void>;
  onRefresh: () => void | Promise<void>;
};

export default function ApprovedPanel({
  listingName,
  listingKey,
  items,
  onUnapprove,
  onRefresh,
}: ApprovedPanelProps) {
  return (
    <div className="rounded border bg-white/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium">
          Approved Reviews {listingKey ? `for ${listingName ?? ""}` : ""}
        </h2>
        {listingKey && (
          <div className="flex gap-2">
            <a
              className="rounded border px-3 py-1 hover:bg-gray-50"
              href={`/listing/${encodeURIComponent(listingKey)}`}
              target="_blank"
            >
              Open public page
            </a>
            <button
              onClick={onRefresh}
              className="rounded border px-3 py-1 hover:bg-gray-50"
              type="button"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {!listingKey && (
        <div className="text-sm text-gray-500">Select a listing to view approved reviews.</div>
      )}

      {listingKey && (
        <div className="space-y-3">
          {(items ?? []).map((r) => (
            <div key={r.id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium text-emerald-700">
                  Rating: {r.overallRating ?? "-"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded border px-2 py-1 text-xs hover:bg-red-50"
                    onClick={() => onUnapprove(r)}
                  >
                    Unapprove
                  </button>
                  <div className="text-xs text-gray-500">
                    {new Date(r.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-700">{r.text}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.categories.map((c) => (
                  <span key={c.category} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                    {c.category}: {c.rating ?? "-"}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {items && items.length === 0 && (
            <div className="text-sm text-gray-500">
              No approved reviews yet for this listing.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
