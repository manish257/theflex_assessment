export default function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
      <div className="rounded border bg-white/60 p-4">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-emerald-700">{value}</div>
      </div>
    );
  }
  