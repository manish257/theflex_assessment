"use client";

type Option = { key: string; name: string };

export default function FiltersBar({
  tab,
  setTab,
  listing,
  setListing,
  minRating,
  setMinRating,
  category,
  setCategory,
  channel,
  setChannel,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  listingOptions,
  allCount,
  approvedCount,
}: {
  tab: "all" | "approved";
  setTab: (v: "all" | "approved") => void;

  listing: string;
  setListing: (v: string) => void;

  minRating: number;
  setMinRating: (v: number) => void;

  category: string;
  setCategory: (v: string) => void;

  channel: string;
  setChannel: (v: string) => void;

  fromDate: string;
  setFromDate: (v: string) => void;

  toDate: string;
  setToDate: (v: string) => void;

  sortBy: "date" | "rating";
  setSortBy: (v: "date" | "rating") => void;

  sortDir: "asc" | "desc";
  setSortDir: (v: "asc" | "desc") => void;

  listingOptions: Option[];

  allCount: number;
  approvedCount: number;
}) {
  const clearAll = () => {
    setListing("");
    setMinRating(0);
    setCategory("");
    setChannel("");
    setFromDate("");
    setToDate("");
  };

  const ratingOptions = Array.from({ length: 10 }, (_, i) => String(i + 1));

  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Listing */}
        <label className="md:col-span-3">
          <span className="mb-1 block text-xs font-medium text-slate-600">Listing</span>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
            value={listing}
            onChange={(e) => setListing(e.target.value)}
          >
            <option value="">All listings</option>
            {listingOptions.map((o) => (
              <option key={o.key} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>
        </label>

        {/* Min rating dropdown */}
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-medium text-slate-600">Min rating</span>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
            value={minRating === 0 ? "" : String(minRating)}
            onChange={(e) => {
              const v = e.target.value;
              setMinRating(v === "" ? 0 : Number(v));
            }}
          >
            <option value="">Any</option>
            {ratingOptions.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </label>

        {/* Category */}
        <label className="md:col-span-3">
          <span className="mb-1 block text-xs font-medium text-slate-600">Category</span>
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
            placeholder="eg cleanliness"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>

        {/* Channel */}
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-medium text-slate-600">Channel</span>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="">All channels</option>
            <option value="hostaway">Hostaway</option>
            <option value="google">Google</option>
          </select>
        </label>

        {/* Tabs */}
        <div className="md:col-span-2 flex items-end justify-end">
          <div
            role="tablist"
            aria-label="Review view"
            className="inline-flex overflow-hidden rounded-full border border-gray-300"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "all"}
              onClick={() => setTab("all")}
              className={`px-3 py-2 text-sm transition ${
                tab === "all"
                  ? "bg-emerald-700 text-white ring-2 ring-emerald-200"
                  : "bg-white text-slate-700 hover:bg-gray-50"
              }`}
              title="Show all reviews"
            >
              All reviews{typeof allCount === "number" ? ` (${allCount})` : ""}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "approved"}
              onClick={() => setTab("approved")}
              className={`px-3 py-2 text-sm transition ${
                tab === "approved"
                  ? "bg-emerald-700 text-white ring-2 ring-emerald-200"
                  : "bg-white text-slate-700 hover:bg-gray-50"
              }`}
              title="Only reviews approved to appear on the public website"
            >
              Approved for website
              {typeof approvedCount === "number" ? ` (${approvedCount})` : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Date range */}
        <div className="md:col-span-6">
          <span className="mb-1 block text-xs font-medium text-slate-600">Date range</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="md:col-span-4">
          <span className="mb-1 block text-xs font-medium text-slate-600">Sort</span>
          <div className="flex gap-2">
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "rating")}
            >
              <option value="date">Date</option>
              <option value="rating">Rating</option>
            </select>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        {/* Clear */}
        <div className="md:col-span-2 flex items-end">
          <button
            type="button"
            onClick={clearAll}
            className="w-full rounded-lg border px-3 py-2 hover:bg-gray-50"
          >
            Clear filters
          </button>
        </div>
      </div>
    </section>
  );
}
