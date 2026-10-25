import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NetworkSearch } from "@/components/network/NetworkSearch";
import { NetworkFilters } from "@/components/network/NetworkFilters";
import { NetworkList } from "@/components/network/NetworkList";
import {
  getPaginatedNetworks,
  getNetworkFilterOptions,
} from "@/lib/repositories/network.repository";
import { NetworkType } from "@prisma/client";
import { Flame } from "lucide-react";

export const metadata = {
  title: "Public Testnets Directory — NodeDrops",
  description:
    "Test validator configurations, client upgrades, and node operations with testnet assets on public blockchain testnets.",
  alternates: {
    canonical: "/testnets",
  },
  openGraph: {
    title: "Public Testnets Directory — NodeDrops",
    description:
      "Test validator configurations, client upgrades, and node operations with testnet assets on public blockchain testnets.",
    url: "https://nodedrops.xyz/testnets",
  },
};

export default async function TestnetsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    role?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};

  const query = resolvedParams.q || "";
  const category = resolvedParams.category || undefined;
  const nodeRole = resolvedParams.role || undefined;
  const sortBy = (resolvedParams.sort as "name_asc" | "name_desc" | "newest" | "featured") || "featured";
  const page = parseInt(resolvedParams.page || "1", 10) || 1;

  // Query MySQL strictly for Testnets
  const [paginatedResult, filterOptions] = await Promise.all([
    getPaginatedNetworks({
      query,
      type: NetworkType.TESTNET,
      category,
      nodeRole,
      sortBy,
      page,
      pageSize: 9,
    }),
    getNetworkFilterOptions(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Breadcrumbs items={[{ label: "Testnets", href: "/testnets" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Public Testnets Directory</span>
              <Badge variant="cyan" size="sm" withDot withPing>Live</Badge>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Verify client upgrades, deposit validator keys, and test node infrastructure with zero economic risk before deploying to mainnet.
            </p>
          </div>
          <Link href="/guides">
            <Button variant="secondary" size="sm" leftIcon={<Flame className="w-3.5 h-3.5 text-amber-400" />}>
              Testnet Validator Runbooks
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <NetworkSearch placeholder="Search testnets (e.g. Holesky, Sepolia)..." />

      {/* Filters (Type filter hidden since this view is testnets-only) */}
      <NetworkFilters
        categories={filterOptions.categories}
        nodeRoles={filterOptions.nodeRoles}
        hideTypeFilter
      />

      {/* Database-Backed Network Grid */}
      <NetworkList
        networks={paginatedResult.networks}
        total={paginatedResult.total}
        totalPages={paginatedResult.totalPages}
        currentPage={paginatedResult.currentPage}
      />
    </div>
  );
}
