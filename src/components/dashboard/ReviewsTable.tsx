"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { listingKeyFrom } from "@/lib/utils";
import { NormalizedReview } from "@/lib/types";

type Row = {
  id: string;
  listingId: string | null;
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
  items: Row[];
  dense: boolean;
  approvedMap: Record<string, string[]> | undefined;
  onToggleApprove: (r: NormalizedReview, approved: boolean) => Promise<void>;
}) {
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [optimistic, setOptimistic] = useState<Record<string, boolean | undefined>>({});

  const approvedSet = useMemo(() => {
    const s = new Set<string>();
    if (approvedMap) {
      for (const ids of Object.values(approvedMap)) {
        for (const id of ids) s.add(id);
      }
    }
    return s;
  }, [approvedMap]);

  const handleToggle = async (r: Row, targetApproved: boolean) => {
    const ok = window.confirm(
      targetApproved
        ? "Approve this review for the public website?"
        : "Unapprove this review so it no longer shows on the public website?"
    );
    if (!ok) return;

    try {
      setPending((p) => ({ ...p, [r.id]: true }));
      setOptimistic((o) => ({ ...o, [r.id]: targetApproved }));

      await onToggleApprove(r as unknown as NormalizedReview, targetApproved);

      setPending((p) => {
        const { [r.id]: _, ...rest } = p;
        return rest;
      });
    } catch {
      setOptimistic((o) => {
        const { [r.id]: _, ...rest } = o;
        return rest;
      });
      setPending((p) => {
        const { [r.id]: _, ...rest } = p;
        return rest;
      });
      alert("Sorry, that action failed. Please try again.");
    }
  };

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
            const key = listingKeyFrom(String(r.listingId ?? ""), r.listingName);
            const serverApproved = approvedSet.has(r.id);
            const effectiveApproved =
              optimistic[r.id] !== undefined ? optimistic[r.id]! : serverApproved;
            const isRowPending = !!pending[r.id];

            return (
              <tr key={r.id} className={`${idx % 2 ? "bg-white/40" : ""} align-top border-t`}>
                <td className="p-2 whitespace-nowrap">
                  {new Date(r.submittedAt).toLocaleDateString()}
                </td>
                <td className="hidden p-2 sm:table-cell">
                  <Link
                    href={`/listing/${key}`}
                    className="text-emerald-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {r.listingName}
                  </Link>
                </td>
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
                    {effectiveApproved && (
                      <span className="shrink-0 rounded border border-emerald-200 bg-emerald-50 px-1 py-0.5 text-[10px] text-emerald-700">
                        Approved
                      </span>
                    )}
                    <span className="line-clamp-2">{r.text}</span>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {!effectiveApproved && (
                      <button
                        className="rounded border px-2 py-1 hover:bg-green-50 disabled:opacity-50"
                        disabled={isRowPending}
                        onClick={() => handleToggle(r, true)}
                      >
                        {isRowPending ? (
                          <span className="inline-flex items-center gap-1">
                            <Spinner /> Approving…
                          </span>
                        ) : (
                          "Approve"
                        )}
                      </button>
                    )}
                    {effectiveApproved && (
                      <button
                        className="rounded border px-2 py-1 hover:bg-red-50 disabled:opacity-50"
                        disabled={isRowPending}
                        onClick={() => handleToggle(r, false)}
                      >
                        {isRowPending ? (
                          <span className="inline-flex items-center gap-1">
                            <Spinner /> Unapproving…
                          </span>
                        ) : (
                          "Unapprove"
                        )}
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

function Spinner() {
  return (
    <svg
      className="h-3 w-3 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
