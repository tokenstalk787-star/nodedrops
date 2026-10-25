import React from "react";
import Link from "next/link";
import { Server, BookOpen, Layers, ArrowRight } from "lucide-react";
import { NetworkCard } from "@/components/network/NetworkCard";
import { GuideCard } from "@/components/guide/GuideCard";
import { GlobalSearchResponse } from "@/lib/repositories/search.repository";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface SearchResultGroupProps {
  searchData: GlobalSearchResponse;
}

export function SearchResultGroup({ searchData }: SearchResultGroupProps) {
  const { type, networks, guides, categories } = searchData;

  const showAll = type === "all";
  const showNetworks = showAll || type === "networks";
  const showGuides = showAll || type === "guides";
  const showCategories = showAll || type === "categories";

  return (
    <div className="space-y-12">
      {/* 1. Networks Group */}
      {showNetworks && networks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Matching Blockchain Networks</span>
              <Badge variant="cyan" size="sm">
                {searchData.counts.networks}
              </Badge>
            </h2>

            {showAll && searchData.counts.networks > 6 && (
              <Link href={`/search?q=${encodeURIComponent(searchData.query)}&type=networks`}>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View all {searchData.counts.networks} networks
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networks.map((network) => (
              <NetworkCard key={network.id} network={network} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Guides & Runbooks Group */}
      {showGuides && guides.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Matching Deployment Runbooks</span>
              <Badge variant="info" size="sm">
                {searchData.counts.guides}
              </Badge>
            </h2>

            {showAll && searchData.counts.guides > 6 && (
              <Link href={`/search?q=${encodeURIComponent(searchData.query)}&type=guides`}>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View all {searchData.counts.guides} guides
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Node Role Categories Group */}
      {showCategories && categories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" />
              <span>Node Role Categories</span>
              <Badge variant="purple" size="sm">
                {searchData.counts.categories}
              </Badge>
            </h2>

            {showAll && searchData.counts.categories > 6 && (
              <Link href={`/search?q=${encodeURIComponent(searchData.query)}&type=categories`}>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View all {searchData.counts.categories} categories
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group p-5 rounded-2xl border border-slate-800 bg-[#070b16] hover:border-cyan-500/40 hover:bg-[#0b1222] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {cat.name}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {cat._count?.guides || 0} runbooks
                    </Badge>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
