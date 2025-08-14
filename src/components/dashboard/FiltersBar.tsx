"use client";

import { useMemo } from "react";

type Option = { key: string; name: string };

export default function FiltersBar({
  listing,
  setListing,
  minRating,
  setMinRating,
  category,
  setCategory,
  channel,
  setChannel,
  rtype,
  setRtype,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  dense,
  setDense,
  listingOptions,
}: {
  listing: string;
  setListing: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  category: string;
  setCategory: (v: string) => void;
  channel: string;
  setChannel: (v: string) => void;
  rtype: string;
  setRtype: (v: string) => void;
  fromDate: string;
  setFromDate: (v: string) => void;
  toDate: string;
  setToDate: (v: string) => void;
  sortBy: "date" | "rating";
  setSortBy: (v: "date" | "rating") => void;
  sortDir: "asc" | "desc";
  setSortDir: (v: "asc" | "desc") => void;
  dense: boolean;
  setDense: (v: boolean) => void;
  listingOptions: Option[];
}) {
  const activeFilters = useMemo(
    () =>
      [
        listing && { label: `Listing: ${listing}` },
        minRating > 0 && { label: `Min rating: ${minRating}` },
        category && { label: `Category: ${category}` },
        channel && { label: `Channel: ${channel}` },
        rtype && { label: `Type: ${rtype === "guest-to-host" ? "Guest to Host" : rtype === "host-to-guest" ? "Host to Guest" : rtype}` },
        fromDate && { label: `From: ${fromDate}` },
        toDate && { label: `To: ${toDate}` },
      ].filter(Boolean) as { label: string }[],
    [listing, minRating, category, channel, rtype, fromDate, toDate]
  );

  return (
    <div className="sticky top-16 z-10 mb-6 rounded-xl border border-gray-200 bg-white/90 p-3 backdrop-blur">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-gray-600">Listing</span>
          <select
            className="w-full rounded border border-gray-200 px-3 py-2"
            value={listing}
            onChange={(e) => setListing(e.target.value)}
          >
            <option value="">All</option>
            {listingOptions.map((o) => (
              <option key={o.key} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <input
          className="rounded border border-gray-200 px-3 py-2"
          type="number"
          min={0}
          max={10}
          step="0.1"
          placeholder="Min rating"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        />

        <input
          className="rounded border border-gray-200 px-3 py-2"
          placeholder="Category (eg cleanliness)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <select
          className="rounded border border-gray-200 px-3 py-2"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="">All channels</option>
          <option value="hostaway">Hostaway</option>
          <option value="google">Google</option>
        </select>

        <select
          className="rounded border border-gray-200 px-3 py-2"
          value={rtype}
          onChange={(e) => setRtype(e.target.value)}
        >
          <option value="">All types</option>
          <option value="guest-to-host">Guest to Host</option>
          <option value="host-to-guest">Host to Guest</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            className="w-full rounded border border-gray-200 px-3 py-2"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            className="w-full rounded border border-gray-200 px-3 py-2"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="rounded border border-gray-200 px-2 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "rating")}
          >
            <option value="date">Sort: Date</option>
            <option value="rating">Sort: Rating</option>
          </select>
          <select
            className="rounded border border-gray-200 px-2 py-2"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilters.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-800"
            >
              {f.label}
            </span>
          ))}
          <button
            type="button"
            onClick={() => {
              setListing("");
              setMinRating(0);
              setCategory("");
              setChannel("");
              setRtype("");
              setFromDate("");
              setToDate("");
            }}
            className="text-xs text-emerald-800 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center justify-end">
        <label className="mr-auto flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={dense} onChange={(e) => setDense(e.target.checked)} />
          Dense view
        </label>
        <div className="ml-auto flex overflow-hidden rounded border">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("dash:setTab", { detail: "all" }))}
            className="px-3 py-2 text-sm" id="tab-all"
          >
            All
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("dash:setTab", { detail: "approved" }))}
            className="px-3 py-2 text-sm" id="tab-approved"
          >
            Approved
          </button>
        </div>
      </div>
    </div>
  );
}
