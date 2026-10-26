"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Layers, Server, BookOpen, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFiltersProps {
  currentType: "all" | "networks" | "guides" | "categories";
  counts: {
    networks: number;
    guides: number;
    categories: number;
  };
}

function SearchFiltersInternal({ currentType, counts }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname() || "/search";
  const searchParams = useSearchParams();

  const totalAll = counts.networks + counts.guides + counts.categories;

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newType === "all") {
      params.delete("type");
    } else {
      params.set("type", newType);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const tabs = [
    {
      id: "all",
      label: "All Results",
      count: totalAll,
      icon: <Grid className="w-4 h-4" />,
    },
    {
      id: "networks",
      label: "Networks",
      count: counts.networks,
      icon: <Server className="w-4 h-4" />,
    },
    {
      id: "guides",
      label: "Guides",
      count: counts.guides,
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "categories",
      label: "Categories",
      count: counts.categories,
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
      {tabs.map((tab) => {
        const isActive = currentType === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTypeChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
              isActive
                ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                isActive
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "bg-slate-800 text-slate-400"
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchFilters(props: SearchFiltersProps) {
  return (
    <Suspense
      fallback={<div className="h-10 w-full rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />}
    >
      <SearchFiltersInternal {...props} />
    </Suspense>
  );
}
