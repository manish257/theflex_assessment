"use client";
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { ReviewsResponse, NormalizedReview } from '@/lib/types';
import { listingKeyFrom } from '@/lib/utils';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const [listing, setListing] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [channel, setChannel] = useState<string>('');
  const [rtype, setRtype] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [tab, setTab] = useState<'all' | 'approved'>('all');
  const [dense, setDense] = useState<boolean>(false);

  const query = new URLSearchParams({
    ...(listing ? { listing } : {}),
    ...(minRating ? { minRating: String(minRating) } : {}),
    ...(category ? { category } : {}),
    ...(channel ? { channel } : {}),
    ...(rtype ? { type: rtype } : {}),
    ...(fromDate ? { from: fromDate } : {}),
    ...(toDate ? { to: toDate } : {}),
    sortBy,
    sortDir,
    pageSize: '50',
  }).toString();

  const { data, isLoading } = useSWR<ReviewsResponse>(`/api/reviews/hostaway?${query}`, fetcher);

  // derive listing options from the current dataset
  const listingOptions = useMemo(() => {
    const set = new Map<string, string>();
    for (const r of data?.items ?? []) {
      const key = listingKeyFrom(r.listingId, r.listingName);
      if (!set.has(key)) set.set(key, r.listingName);
    }
    return Array.from(set.entries()).map(([key, name]) => ({ key, name }));
  }, [data]);

  // Pull approved ids for currently visible listings (to display an inline Approved badge)
  const approvedMapUrl = useMemo(() => {
    if (!data?.items) return null;
    const keys = Array.from(
      new Set(
        data.items.map((r) => listingKeyFrom(r.listingId, r.listingName))
      )
    );
    if (keys.length === 0) return null;
    return `/api/reviews/approved-map?listingKeys=${encodeURIComponent(keys.join(','))}`;
  }, [data]);
  const { data: approvedMapData } = useSWR<{ map: Record<string, string[]> }>(approvedMapUrl, fetcher);

  const currentListingKey = useMemo(() => {
    const r = (data?.items ?? []).find(i => i.listingId === listing || i.listingName === listing);
    if (r) return listingKeyFrom(r.listingId, r.listingName);
    // if user typed exact key like listing-L-1001
    if (listing.startsWith('listing-')) return listing;
    return '';
  }, [data, listing]);

  const { data: approvedData, mutate: refreshApproved } = useSWR<{ items: NormalizedReview[] }>(
    tab === 'approved' && currentListingKey
      ? `/api/reviews/public?listingKey=${encodeURIComponent(currentListingKey)}`
      : null,
    fetcher
  );

  const onToggleApprove = async (r: NormalizedReview, approved: boolean) => {
    const listingKey = r.listingId ? `listing-${r.listingId}` : `listing-${r.listingName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
    await fetch('/api/reviews/selection', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ listingKey, reviewId: r.id, approved }),
    });
    // If user is viewing the Approved tab for this listing, refresh it immediately
    if (listingKey === currentListingKey) {
      await refreshApproved?.();
    }
  };

  const chartData = useMemo(() => {
    const ts = data?.aggregates.timeSeriesMonthly ?? [];
    return {
      labels: ts.map((t) => t.month),
      datasets: [
        {
          label: 'Count',
          data: ts.map((t) => t.count),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14,165,233,0.2)',
          yAxisID: 'y',
        },
        {
          label: 'Avg Rating',
          data: ts.map((t) => t.avgRating ?? null),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.2)',
          yAxisID: 'y1',
        },
      ],
    };
  }, [data]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4 text-emerald-900">Flex Living Reviews Dashboard</h1>
      <form
        action="/api/auth/logout"
        method="post"
        className="mb-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.href = '/signin';
        }}
      >
        <button type="submit" className="border rounded px-3 py-2 hover:bg-gray-50">Sign out</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 shrink-0">Listing</span>
          <select className="border rounded px-3 py-2 w-full" value={listing}
            onChange={(e) => setListing(e.target.value)}>
            <option value="">All</option>
            {listingOptions.map(o => (
              <option key={o.key} value={o.name}>{o.name}</option>
            ))}
          </select>
        </div>
        <input
          className="border rounded px-3 py-2"
          type="number"
          placeholder="Min rating"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Category (e.g. cleanliness)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select className="border rounded px-3 py-2" value={channel} onChange={(e)=>setChannel(e.target.value)}>
          <option value="">All channels</option>
          <option value="hostaway">Hostaway</option>
          <option value="google">Google</option>
        </select>
        <select className="border rounded px-3 py-2" value={rtype} onChange={(e)=>setRtype(e.target.value)}>
          <option value="">All types</option>
          <option value="guest-to-host">Guest → Host</option>
          <option value="host-to-guest">Host → Guest</option>
        </select>
        <div className="flex items-center gap-2">
          <input type="date" className="border rounded px-3 py-2 w-full" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} />
          <span className="text-gray-400">–</span>
          <input type="date" className="border rounded px-3 py-2 w-full" value={toDate} onChange={(e)=>setToDate(e.target.value)} />
        </div>
        <div className="flex gap-2 items-center">
          <select className="border rounded px-2 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}>
            <option value="date">Sort: Date</option>
            <option value="rating">Sort: Rating</option>
          </select>
          <select className="border rounded px-2 py-2" value={sortDir} onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
        <div className="flex items-end gap-2 flex-wrap justify-end">
          <label className="text-sm text-gray-600 flex items-center gap-2 mr-auto">
            <input type="checkbox" checked={dense} onChange={(e)=>setDense(e.target.checked)} />
            Dense view
          </label>
          <div className="ml-auto flex rounded overflow-hidden border">
            <button type="button" onClick={() => setTab('all')} className={`px-3 py-2 text-sm ${tab==='all'?'bg-emerald-600 text-white':'bg-white'}`}>All</button>
            <button type="button" onClick={() => setTab('approved')} className={`px-3 py-2 text-sm ${tab==='approved'?'bg-emerald-600 text-white':'bg-white'}`}>Approved</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4 bg-white/60"><div className="text-sm text-gray-500">Total</div><div className="text-2xl font-bold text-emerald-700">{data?.aggregates.counts.total ?? 0}</div></div>
        <div className="border rounded p-4 bg-white/60"><div className="text-sm text-gray-500">Avg Rating</div><div className="text-2xl font-bold text-emerald-700">{data?.aggregates.avgOverallRating ?? '-'}</div></div>
        <div className="border rounded p-4 bg-white/60"><div className="text-sm text-gray-500">Top Category</div><div className="text-2xl font-bold text-emerald-700">{Object.entries(data?.aggregates.avgByCategory ?? {}).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? '-'}</div></div>
      </div>

      <div className="border rounded p-4 mb-8">
        <h2 className="font-medium mb-2">Trends</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: { y: { type: 'linear', position: 'left' }, y1: { type: 'linear', position: 'right' } },
          }}
        />
      </div>

      {/* Per‑listing performance summary */}
      <div className="border rounded p-4 mb-8 bg-white/60">
        <h2 className="font-medium mb-3">Per‑property performance</h2>
        <table className={`w-full ${dense ? 'text-xs' : 'text-sm'}`}>
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">Listing</th>
              <th className="p-2">Reviews</th>
              <th className="p-2">Avg rating</th>
              <th className="p-2 hidden sm:table-cell">Last review</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(
              (data?.items ?? []).reduce((m, r) => {
                const k = listingKeyFrom(r.listingId, r.listingName);
                const s = m.get(k) || { name: r.listingName, n: 0, sum: 0, last: '' };
                s.n += 1;
                s.sum += r.overallRating ?? 0;
                if (!s.last || new Date(r.submittedAt) > new Date(s.last)) s.last = r.submittedAt;
                m.set(k, s);
                return m;
              }, new Map<string, { name: string; n: number; sum: number; last: string }>)
            ).map(([k, v]) => (
              <tr key={k} className="border-t">
                <td className="p-2">{v.name}</td>
                <td className="p-2">{v.n}</td>
                <td className="p-2">{v.n ? (v.sum / v.n).toFixed(2) : '-'}</td>
                <td className="p-2 hidden sm:table-cell">{v.last ? new Date(v.last).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
            {(!data || (data.items ?? []).length === 0) && (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Categories summary to spot recurring issues */}
      <div className="border rounded p-4 mb-8 bg-white/60">
        <h2 className="font-medium mb-3">Category insights</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(data?.aggregates.avgByCategory ?? {})
            .sort((a, b) => a[1] - b[1])
            .map(([cat, avg]) => (
              <span key={cat} className="text-xs bg-gray-100 rounded px-3 py-1">
                {cat}: {avg.toFixed(2)}
              </span>
            ))}
          {Object.keys(data?.aggregates.avgByCategory ?? {}).length === 0 && (
            <span className="text-sm text-gray-500">No category data</span>
          )}
        </div>
      </div>

      {tab === 'all' && (
      <div className="border rounded overflow-hidden bg-white/60">
        <table className={`w-full ${dense ? 'text-xs' : 'text-sm'}`}>
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2 hidden sm:table-cell">Listing</th>
              <th className="p-2 hidden md:table-cell">Channel</th>
              <th className="p-2">Rating</th>
              <th className="p-2 hidden md:table-cell">Categories</th>
              <th className="p-2">Text</th>
              <th className="p-2">Approve</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items ?? []).map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2 whitespace-nowrap">{new Date(r.submittedAt).toLocaleDateString()}</td>
                <td className="p-2 hidden sm:table-cell">{r.listingName}</td>
                <td className="p-2 hidden md:table-cell">{r.channel}</td>
                <td className="p-2">{r.overallRating ?? '-'}</td>
                <td className="p-2 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {r.categories.map((c) => (
                      <span key={c.category} className="text-xs bg-gray-100 rounded px-2 py-0.5">
                        {c.category}: {c.rating ?? '-'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-2 max-w-[380px] truncate" title={r.text}>
                  <div className="flex items-center gap-2">
                    {approvedMapData?.map?.[listingKeyFrom(r.listingId, r.listingName)]?.includes(r.id) && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 shrink-0">Approved</span>
                    )}
                    <span className="truncate">{r.text}</span>
                  </div>
                </td>
                <td className="p-2">
                  {(() => {
                    const key = listingKeyFrom(r.listingId, r.listingName);
                    const isApproved = approvedMapData?.map?.[key]?.includes(r.id);
                    return (
                      <div className="flex gap-2">
                        {!isApproved && (
                          <button className="border rounded px-2 py-1 hover:bg-green-50" onClick={() => onToggleApprove(r, true)}>
                            Approve
                          </button>
                        )}
                        {isApproved && (
                          <button className="border rounded px-2 py-1 hover:bg-red-50" onClick={() => onToggleApprove(r, false)}>
                            Unapprove
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </td>
              </tr>
            ))}
            {(!data || data.items.length === 0) && (
              <tr><td className="p-4 text-center text-gray-500" colSpan={7}>{isLoading ? 'Loading…' : 'No reviews found'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {tab === 'approved' && (
        <div className="border rounded p-4 bg-white/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Approved Reviews {currentListingKey ? `for ${listing || listingOptions.find(o=>o.key===currentListingKey)?.name || ''}` : ''}</h2>
            {currentListingKey && (
              <div className="flex gap-2">
                <a className="border rounded px-3 py-1 hover:bg-gray-50" href={`/listing/${encodeURIComponent(currentListingKey)}`} target="_blank">Open public page</a>
                <button onClick={() => refreshApproved?.()} className="border rounded px-3 py-1 hover:bg-gray-50" type="button">Refresh</button>
              </div>
            )}
          </div>
          {!currentListingKey && <div className="text-sm text-gray-500">Select a listing to view approved reviews.</div>}
          {currentListingKey && (
            <div className="space-y-3">
              {(approvedData?.items ?? []).map(r => (
                <div key={r.id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-emerald-700">Rating: {r.overallRating ?? '-'}</div>
                    <div className="flex items-center gap-2">
                      <button className="border rounded px-2 py-1 hover:bg-red-50 text-xs" onClick={() => onToggleApprove(r, false)}>Unapprove</button>
                      <div className="text-xs text-gray-500">{new Date(r.submittedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">{r.text}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.categories.map(c => (
                      <span key={c.category} className="text-xs bg-gray-100 rounded px-2 py-0.5">{c.category}: {c.rating ?? '-'}</span>
                    ))}
                  </div>
                </div>
              ))}
              {approvedData && approvedData.items.length === 0 && (
                <div className="text-sm text-gray-500">No approved reviews yet for this listing.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


