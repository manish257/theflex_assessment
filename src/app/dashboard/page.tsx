"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { ReviewsResponse, NormalizedReview } from "@/lib/types";
import { listingKeyFrom } from "@/lib/utils";

// Components
import StatsRow from "@/components/dashboard/StatsRow";
import FiltersBar from "@/components/dashboard/FiltersBar";
import TrendsChart from "@/components/dashboard/TrendsChart";
import PerformanceTable from "@/components/dashboard/PerformanceTable";
import CategoryInsights from "@/components/dashboard/CategoryInsights";
import ReviewsTable from "@/components/dashboard/ReviewsTable";
import ApprovedPanel from "@/components/dashboard/ApprovedPanel";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const [listing, setListing] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [channel, setChannel] = useState<string>("");
  const [rtype, setRtype] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tab, setTab] = useState<"all" | "approved">("all");
  const [dense, setDense] = useState<boolean>(false);

  // Main query (affected by selected listing)
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
    pageSize: "50",
  }).toString();

  const { data, isLoading } = useSWR<ReviewsResponse>(
    `/api/reviews/hostaway?${query}`,
    fetcher
  );

  // Secondary query for the listing dropdown (never filtered by listing)
  const queryForOptions = new URLSearchParams({
    ...(minRating ? { minRating: String(minRating) } : {}),
    ...(category ? { category } : {}),
    ...(channel ? { channel } : {}),
    ...(rtype ? { type: rtype } : {}),
    ...(fromDate ? { from: fromDate } : {}),
    ...(toDate ? { to: toDate } : {}),
    pageSize: "200",
    sortBy: "date",
    sortDir: "desc",
  }).toString();

  const { data: dataForOptions } = useSWR<ReviewsResponse>(
    `/api/reviews/hostaway?${queryForOptions}`,
    fetcher
  );

  // Build dropdown options from the unfiltered-by-listing dataset
  const listingOptions = useMemo(() => {
    const set = new Map<string, string>();
    for (const r of dataForOptions?.items ?? []) {
      const key = listingKeyFrom(r.listingId, r.listingName);
      if (!set.has(key)) set.set(key, r.listingName);
    }
    return Array.from(set.entries()).map(([key, name]) => ({ key, name }));
  }, [dataForOptions]);

  // Approved map for badges
  const approvedMapUrl = useMemo(() => {
    if (!data?.items) return null;
    const keys = Array.from(
      new Set(data.items.map((r) => listingKeyFrom(r.listingId, r.listingName)))
    );
    if (keys.length === 0) return null;
    return `/api/reviews/approved-map?listingKeys=${encodeURIComponent(
      keys.join(",")
    )}`;
  }, [data]);
  const { data: approvedMapData } = useSWR<{ map: Record<string, string[]> }>(
    approvedMapUrl,
    fetcher
  );

  // Current listing key
  const currentListingKey = useMemo(() => {
    const r =
      (data?.items ?? []).find(
        (i) => i.listingId === listing || i.listingName === listing
      ) || null;
    if (r) return listingKeyFrom(r.listingId, r.listingName);
    if (listing.startsWith("listing-")) return listing;
    return "";
  }, [data, listing]);

  // Approved-tab data
  const { data: approvedData, mutate: refreshApproved } = useSWR<{
    items: NormalizedReview[];
  }>(
    tab === "approved" && currentListingKey
      ? `/api/reviews/public?listingKey=${encodeURIComponent(
          currentListingKey
        )}`
      : null,
    fetcher
  );

  // Approve / Unapprove
  const onToggleApprove = async (r: NormalizedReview, approved: boolean) => {
    const listingKey = r.listingId
      ? `listing-${r.listingId}`
      : `listing-${r.listingName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await fetch("/api/reviews/selection", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listingKey, reviewId: r.id, approved }),
    });
    if (listingKey === currentListingKey) await refreshApproved?.();
  };

  // Chart props
  const labels = data?.aggregates.timeSeriesMonthly?.map((t) => t.month) ?? [];
  const counts = data?.aggregates.timeSeriesMonthly?.map((t) => t.count) ?? [];
  const avgRatings =
    data?.aggregates.timeSeriesMonthly?.map((t) => t.avgRating ?? null) ?? [];

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold text-emerald-900 sm:text-3xl">
          Flex Living Reviews Dashboard
        </h1>
        <form
          action="/api/auth/logout"
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/signin";
          }}
        >
          <button
            type="submit"
            className="rounded border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Stats */}
      <StatsRow
        total={data?.aggregates.counts.total}
        avgOverallRating={data?.aggregates.avgOverallRating}
        avgByCategory={data?.aggregates.avgByCategory}
      />

      {/* Filters */}
      <FiltersBar
        tab={tab}
        setTab={setTab}
        listing={listing}
        setListing={setListing}
        minRating={minRating}
        setMinRating={setMinRating}
        category={category}
        setCategory={setCategory}
        channel={channel}
        setChannel={setChannel}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        listingOptions={listingOptions}
      />

      {/* Trends chart */}
      <TrendsChart labels={labels} counts={counts} avgRatings={avgRatings} />

      {/* Per property table */}
      <PerformanceTable
        items={data?.items ?? []}
        dense={dense}
        isLoading={isLoading}
      />

      {/* Category insights */}
      <CategoryInsights avgByCategory={data?.aggregates.avgByCategory} />

      {/* All reviews or Approved panel */}
      {tab === "all" && (
        <ReviewsTable
          items={data?.items ?? []}
          dense={dense}
          approvedMap={approvedMapData?.map}
          onToggleApprove={onToggleApprove}
        />
      )}

      {tab === "approved" && (
        <ApprovedPanel
          listingName={
            currentListingKey
              ? listing ||
                (listingOptions.find((o) => o.key === currentListingKey)
                  ?.name ??
                  "")
              : undefined
          }
          listingKey={currentListingKey || null}
          items={approvedData?.items}
          onUnapprove={(r) => onToggleApprove(r, false)}
          onRefresh={async () => {
            await refreshApproved?.();
          }}
        />
      )}
    </div>
  );
}
