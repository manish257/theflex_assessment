import { listingKeyFrom } from "@/lib/utils";
import { NormalizedReview } from "@/lib/types";

type Row = {
  id: string;
  listingId: string | null; // allow null
  listingName: string;
  submittedAt: string;
  overallRating: number | null;
  channel: string;
  categories: { category: string; rating: number | null }[];
  text: string;
};

export default function ReviewsTable({
  items,
  dense,
  approvedMap,
  onToggleApprove,
}: {
  items: Row[];                                  // use Row[]
  dense: boolean;
  approvedMap: Record<string, string[]> | undefined;
  onToggleApprove: (r: NormalizedReview, approved: boolean) => Promise<void>;
}) {
  return (
    <div className="rounded border bg-white/60">
      <table className={`w-full ${dense ? "text-xs" : "text-sm"}`}>
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-2">Date</th>
            <th className="hidden p-2 sm:table-cell">Listing</th>
            <th className="hidden p-2 md:table-cell">Channel</th>
            <th className="p-2">Rating</th>
            <th className="hidden p-2 md:table-cell">Categories</th>
            <th className="p-2">Text</th>
            <th className="p-2">Approve</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, idx) => {
            const key = listingKeyFrom(String(r.listingId ?? ""), r.listingName); // guard null
            const isApproved = approvedMap?.[key]?.includes(r.id);
            return (
              <tr key={r.id} className={`${idx % 2 ? "bg-white/40" : ""} align-top border-t`}>
                <td className="p-2 whitespace-nowrap">
                  {new Date(r.submittedAt).toLocaleDateString()}
                </td>
                <td className="hidden p-2 sm:table-cell">{r.listingName}</td>
                <td className="hidden p-2 md:table-cell">{r.channel}</td>
                <td className="p-2">{r.overallRating ?? "-"}</td>
                <td className="hidden p-2 md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {r.categories.map((c) => (
                      <span key={c.category} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                        {c.category}: {c.rating ?? "-"}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="max-w-[380px] p-2" title={r.text}>
                  <div className="flex items-center gap-2">
                    {isApproved && (
                      <span className="shrink-0 rounded border border-emerald-200 bg-emerald-50 px-1 py-0.5 text-[10px] text-emerald-700">
                        Approved
                      </span>
                    )}
                    <span className="line-clamp-2">{r.text}</span>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    {!isApproved && (
                      <button
                        className="rounded border px-2 py-1 hover:bg-green-50"
                        onClick={() => onToggleApprove(r as unknown as NormalizedReview, true)}
                      >
                        Approve
                      </button>
                    )}
                    {isApproved && (
                      <button
                        className="rounded border px-2 py-1 hover:bg-red-50"
                        onClick={() => onToggleApprove(r as unknown as NormalizedReview, false)}
                      >
                        Unapprove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={7}>
                No reviews found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
