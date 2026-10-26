import React from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { NetworkSearch } from "@/components/network/NetworkSearch";
import { GuideFilters } from "@/components/guide/GuideFilters";
import { GuideCard } from "@/components/guide/GuideCard";
import { UrlPagination } from "@/components/ui/UrlPagination";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getPaginatedGuides,
  getGuideFilterOptions,
} from "@/lib/repositories/guide.repository";
import { Difficulty, PublicationStatus } from "@prisma/client";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Node Deployment Runbooks & Guides — NodeDrops",
  description:
    "Verified step-by-step guides for installing, syncing, securing, and maintaining blockchain nodes.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "Node Deployment Runbooks & Guides — NodeDrops",
    description:
      "Verified step-by-step guides for installing, syncing, securing, and maintaining blockchain nodes.",
    url: "https://nodedrops.xyz/guides",
  },
};

export default async function GuidesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    difficulty?: string;
    network?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};

  const query = resolvedParams.q || "";
  const difficultyParam = resolvedParams.difficulty?.toUpperCase();
  const difficulty =
    difficultyParam === "BEGINNER"
      ? Difficulty.BEGINNER
      : difficultyParam === "INTERMEDIATE"
      ? Difficulty.INTERMEDIATE
      : difficultyParam === "ADVANCED"
      ? Difficulty.ADVANCED
      : undefined;

  const networkSlug = resolvedParams.network || undefined;
  const categorySlug = resolvedParams.category || undefined;
  const page = parseInt(resolvedParams.page || "1", 10) || 1;

  // Query MySQL strictly for PUBLISHED guides
  const [paginatedResult, filterOptions] = await Promise.all([
    getPaginatedGuides({
      query,
      difficulty,
      networkSlug,
      categorySlug,
      status: PublicationStatus.PUBLISHED,
      page,
      pageSize: 8,
    }),
    getGuideFilterOptions(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Breadcrumbs items={[{ label: "Guides", href: "/guides" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Node Deployment Runbooks</span>
              <Badge variant="cyan" size="sm" withDot>Verified</Badge>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Step-by-step installation instructions, Docker compose templates, configuration flags, and post-sync health checks.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {paginatedResult.total} Published Runbooks
          </span>
        </div>
      </div>

      {/* Search Input */}
      <NetworkSearch placeholder="Search runbooks by title, client software, or network..." />

      {/* Filter Toolbar */}
      <GuideFilters
        categories={filterOptions.categories}
        networks={filterOptions.networks}
      />

      {/* Guide Cards Grid */}
      {paginatedResult.guides.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedResult.guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>

          {paginatedResult.totalPages > 1 && (
            <div className="pt-6 border-t border-slate-800">
              <UrlPagination
                currentPage={paginatedResult.currentPage}
                totalPages={paginatedResult.totalPages}
              />
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-7 h-7 text-cyan-400" />}
          title="No Guides Found"
          description="We could not find any published runbooks matching your search and filter criteria. Try adjusting the difficulty or network filter."
          actionLabel="Reset Filters"
          actionHref="/guides"
        />
      )}
    </div>
  );
}
