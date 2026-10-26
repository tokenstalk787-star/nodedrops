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
import { ShieldCheck } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Production Mainnets Directory — NodeDrops",
  description:
    "Production blockchain full nodes, validators, and RPC endpoints for Ethereum, Arbitrum, Base, Solana, and major ecosystems.",
  alternates: {
    canonical: "/mainnets",
  },
  openGraph: {
    title: "Production Mainnets Directory — NodeDrops",
    description:
      "Production blockchain full nodes, validators, and RPC endpoints for Ethereum, Arbitrum, Base, Solana, and major ecosystems.",
    url: "https://nodedrops.xyz/mainnets",
  },
};

export default async function MainnetsPage({
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

  // Query MySQL strictly for Mainnets
  const [paginatedResult, filterOptions] = await Promise.all([
    getPaginatedNetworks({
      query,
      type: NetworkType.MAINNET,
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
        <Breadcrumbs items={[{ label: "Mainnets", href: "/mainnets" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Production Mainnets</span>
              <Badge variant="success" size="sm" withDot>Mainnet</Badge>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Production full nodes, validators, and high-throughput RPC endpoints for Layer 1 and Layer 2 mainnets.
            </p>
          </div>
          <Link href="/guides">
            <Button variant="secondary" size="sm" leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}>
              Production Hardening Guide
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <NetworkSearch placeholder="Search mainnets (e.g. Ethereum, Arbitrum, Solana)..." />

      {/* Filters (Type filter hidden since this view is mainnets-only) */}
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
