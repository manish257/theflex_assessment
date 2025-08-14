import StatCard from "./StatCard";

function formatNumber(v: number | null | undefined) {
  if (v == null) return "-";
  return Number(v).toFixed(2);
}

export default function StatsRow({
  total,
  avgOverallRating,
  avgByCategory,
}: {
  total: number | undefined;
  avgOverallRating: number | null | undefined;
  avgByCategory: Record<string, number> | undefined;
}) {
  const topCat =
    Object.entries(avgByCategory ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard label="Total" value={total ?? 0} />
      <StatCard label="Avg rating" value={formatNumber(avgOverallRating)} />
      <StatCard label="Top category" value={topCat} />
    </div>
  );
}
