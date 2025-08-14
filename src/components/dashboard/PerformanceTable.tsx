import { listingKeyFrom } from "@/lib/utils";

type Row = {
  id: string;
  listingId: string | null; // allow null
  listingName: string;
  submittedAt: string;
  overallRating: number | null;
};

export default function PerformanceTable({
  items,
  dense,
  isLoading,
}: {
  items: Row[];
  dense: boolean;
  isLoading: boolean;
}) {
  const rows = Array.from(
    (items ?? []).reduce((m, r) => {
      const key = listingKeyFrom(String(r.listingId ?? ""), r.listingName);
      const s = m.get(key) || { name: r.listingName, n: 0, sum: 0, last: "" };
      s.n += 1;
      s.sum += r.overallRating ?? 0;
      if (!s.last || new Date(r.submittedAt) > new Date(s.last)) s.last = r.submittedAt;
      m.set(key, s);
      return m;
    }, new Map<string, { name: string; n: number; sum: number; last: string }>)
  );

  return (
    <div className="mb-8 rounded border bg-white/60 p-4">
      <h2 className="mb-3 font-medium">Per property performance</h2>
      <table className={`w-full ${dense ? "text-xs" : "text-sm"}`}>
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-2">Listing</th>
            <th className="p-2">Reviews</th>
            <th className="p-2">Avg rating</th>
            <th className="hidden p-2 sm:table-cell">Last review</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, v], idx) => (
            <tr key={key} className={idx % 2 ? "bg-white/40" : ""}>
              <td className="p-2">{v.name}</td>
              <td className="p-2">{v.n}</td>
              <td className="p-2">{v.n ? (v.sum / v.n).toFixed(2) : "-"}</td>
              <td className="hidden p-2 sm:table-cell">
                {v.last ? new Date(v.last).toLocaleDateString() : "-"}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                {isLoading ? "Loading…" : "No data"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
