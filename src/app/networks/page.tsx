import React from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { NetworkSearch } from "@/components/network/NetworkSearch";
import { NetworkFilters } from "@/components/network/NetworkFilters";
import { NetworkList } from "@/components/network/NetworkList";
import {
  getPaginatedNetworks,
  getNetworkFilterOptions,
} from "@/lib/repositories/network.repository";
import { NetworkType } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Blockchain Networks Directory — NodeDrops",
  description:
    "Explore supported blockchain networks, consensus types, empirical hardware baselines, and verified client software.",
  alternates: {
    canonical: "/networks",
  },
  openGraph: {
    title: "Blockchain Networks Directory — NodeDrops",
    description:
      "Explore supported blockchain networks, consensus types, empirical hardware baselines, and verified client software.",
    url: "https://nodedrops.xyz/networks",
  },
};

export default async function NetworksPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    type?: string;
    category?: string;
    role?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};

  const query = resolvedParams.q || "";
  const typeParam = resolvedParams.type?.toUpperCase();
  const networkType =
    typeParam === "MAINNET"
      ? NetworkType.MAINNET
      : typeParam === "TESTNET"
      ? NetworkType.TESTNET
      : undefined;

  const category = resolvedParams.category || undefined;
  const nodeRole = resolvedParams.role || undefined;
  const sortBy = (resolvedParams.sort as "name_asc" | "name_desc" | "newest" | "featured") || "featured";
  const page = parseInt(resolvedParams.page || "1", 10) || 1;

  // Execute database queries in parallel
  const [paginatedResult, filterOptions] = await Promise.all([
    getPaginatedNetworks({
      query,
      type: networkType,
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
        <Breadcrumbs items={[{ label: "Networks", href: "/networks" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Blockchain Networks Directory
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse production mainnets and public testnets with empirical hardware baselines and verified client software.
            </p>
          </div>
          <Badge variant="cyan" size="md" withDot>
            Live Database
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <NetworkSearch />

      {/* Filter and Sort Toolbar */}
      <NetworkFilters
        categories={filterOptions.categories}
        nodeRoles={filterOptions.nodeRoles}
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
