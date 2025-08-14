export default function CategoryInsights({
    avgByCategory,
  }: {
    avgByCategory: Record<string, number> | undefined;
  }) {
    const entries = Object.entries(avgByCategory ?? {}).sort((a, b) => a[1] - b[1]);
  
    return (
      <div className="mb-8 rounded border bg-white/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Category insights</h2>
          <span className="text-xs text-gray-500">Lower scores surface first</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {entries.map(([cat, avg]) => (
            <span key={cat} className="rounded bg-gray-100 px-3 py-1 text-xs" title={`${cat} average`}>
              {cat}: {avg.toFixed(2)}
            </span>
          ))}
          {entries.length === 0 && <span className="text-sm text-gray-500">No category data</span>}
        </div>
      </div>
    );
  }
  