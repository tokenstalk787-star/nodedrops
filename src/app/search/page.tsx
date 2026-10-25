import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { UrlPagination } from "@/components/ui/UrlPagination";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResultGroup } from "@/components/search/SearchResultGroup";
import { searchGlobal } from "@/lib/repositories/search.repository";
import { Search as SearchIcon, RotateCcw } from "lucide-react";

interface SearchPageProps {
  searchParams?: Promise<{
    q?: string;
    type?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {};
  const query = resolved.q?.trim();

  if (query) {
    return {
      title: `Search: "${query}" | NodeDrops`,
      description: `Explore blockchain networks, client runbooks, and node roles matching "${query}".`,
    };
  }

  return {
    title: "Global Search — NodeDrops",
    description: "Search supported blockchain networks, step-by-step setup guides, and node categories.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = searchParams ? await searchParams : {};
  const query = resolved.q || "";
  const rawType = resolved.type?.toLowerCase();
  const type =
    rawType === "networks" || rawType === "guides" || rawType === "categories"
      ? (rawType as "networks" | "guides" | "categories")
      : "all";
  const page = parseInt(resolved.page || "1", 10) || 1;

  const searchData = await searchGlobal({
    query,
    type,
    page,
    pageSize: 9,
  });

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Search", href: "/search", current: true },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Search Header Banner */}
        <header className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="md">
              <SearchIcon className="w-3.5 h-3.5 mr-1" />
              Global Discovery
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              Indexed Across Networks, Runbooks &amp; Node Roles
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Search NodeDrops
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Find Layer 1 and Layer 2 network specifications, verified execution and consensus client runbooks, and hardware requirements.
          </p>
        </header>

        {/* Global Search Input Box */}
        <SearchInput initialQuery={query} />

        {/* Filter Tabs by Result Type */}
        <SearchFilters currentType={type} counts={searchData.counts} />

        {/* Results Counter / Query Echo */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 font-mono">
          <div>
            {query ? (
              <span>
                Found{" "}
                <strong className="text-cyan-300 font-bold">{searchData.totalCount}</strong>{" "}
                results for &ldquo;<span className="text-white">{query}</span>&rdquo;
              </span>
            ) : (
              <span>
                Showing featured networks, guides, and categories (
                <strong className="text-cyan-300">{searchData.totalCount}</strong> total items)
              </span>
            )}
          </div>

          {query && (
            <Link href="/search" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 font-sans">
              <RotateCcw className="w-3 h-3" />
              <span>Clear query</span>
            </Link>
          )}
        </div>

        {/* Results Listing or Empty State */}
        {searchData.totalCount > 0 ? (
          <div className="space-y-10">
            <SearchResultGroup searchData={searchData} />

            {/* Pagination Controls */}
            {searchData.totalPages > 1 && (
              <div className="pt-8 border-t border-slate-800">
                <UrlPagination
                  currentPage={searchData.currentPage}
                  totalPages={searchData.totalPages}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="pt-4">
            <EmptyState
              icon={<SearchIcon className="w-8 h-8 text-cyan-400" />}
              title="No Results Found"
              description={`We couldn't find any active networks, guides, or node categories matching "${query}". Try searching by ecosystem name, client software (e.g. Geth), or node role.`}
            />
            <div className="mt-4 flex justify-center">
              <Link href="/search">
                <Button variant="secondary" size="sm">
                  Reset Search
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
