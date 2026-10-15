
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OpportunityCard } from "@/components/opportunity-card";

export type DirectoryOpportunity = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  category: string;
  network: string | null;
  status: string;
  incentiveStatus: string;
  difficulty: string | null;
  estimatedCostUsd: string | null;
  officialUrl: string | null;
  logoUrl?: string | null;
  sourceUrl: string | null;
  lastVerifiedAt: string | null;
  verificationNotes: string | null;
};

type Filters = {
  q: string;
  category: string;
  status: string;
  incentiveStatus: string;
};

type OpportunityDirectoryProps = {
  opportunities: DirectoryOpportunity[];
  initialFilters: Filters;
};

const categories = [
  "Testnet",
  "Node",
  "Developer",
  "DeFi",
  "Infrastructure",
  "Other",
];

const statuses = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "ENDED", label: "Ended" },
];

const incentives = [
  { value: "CONFIRMED", label: "Confirmed incentive" },
  { value: "POTENTIAL", label: "Potential incentive" },
  { value: "NOT_ANNOUNCED", label: "Not announced" },
];

const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-[#0c1016] px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10";

export function OpportunityDirectory({
  opportunities,
  initialFilters,
}: OpportunityDirectoryProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialFilters.q);
  const [category, setCategory] = useState(initialFilters.category);
  const [status, setStatus] = useState(initialFilters.status);
  const [incentiveStatus, setIncentiveStatus] = useState(
    initialFilters.incentiveStatus,
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return opportunities.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          item.name,
          item.summary,
          item.category,
          item.network ?? "",
        ].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return (
        matchesQuery &&
        (!category || item.category === category) &&
        (!status || item.status === status) &&
        (!incentiveStatus ||
          item.incentiveStatus === incentiveStatus)
      );
    });
  }, [opportunities, query, category, status, incentiveStatus]);

  function clearFilters() {
    setQuery("");
    setCategory("");
    setStatus("");
    setIncentiveStatus("");
    router.replace("/opportunities", { scroll: false });
  }

  const hasFilters = Boolean(
    query || category || status || incentiveStatus,
  );

  return (
    <div>
      <section
        aria-label="Search and filter opportunities"
        className="rounded-2xl border border-white/10 bg-[#10131a] p-4 sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-4">
            <label
              htmlFor="opportunity-search"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Search opportunities
            </label>
            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500"
              >
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="m16 16 4.2 4.2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="opportunity-search"
                type="search"
                maxLength={100}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by project, network or keyword..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="filter-category"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Category
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
            >
              <option value="">All categories</option>
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-status"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Program status
            </label>
            <select
              id="filter-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={inputClass}
            >
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-incentive"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Incentive information
            </label>
            <select
              id="filter-incentive"
              value={incentiveStatus}
              onChange={(event) =>
                setIncentiveStatus(event.target.value)
              }
              className={inputClass}
            >
              <option value="">All incentive labels</option>
              {incentives.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-11 w-full rounded-xl border border-white/10 px-4 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      <div className="my-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400" aria-live="polite">
          <span className="font-semibold text-white">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "opportunity" : "opportunities"} found
        </p>
        <p className="text-xs text-slate-500">
          Demo records are excluded from this directory.
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-14 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl text-slate-400">
            ⌕
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">
            {opportunities.length === 0
              ? "More opportunities are on the way"
              : "No matching opportunities"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            {opportunities.length === 0
              ? "The directory has no published non-demo listings yet. Check back as source-backed opportunities are added."
              : "Try another keyword or remove one or more filters to broaden your search."}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
