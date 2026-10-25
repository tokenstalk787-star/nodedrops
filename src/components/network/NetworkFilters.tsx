"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export interface NetworkFiltersProps {
  categories: string[];
  nodeRoles: string[];
  hideTypeFilter?: boolean;
}

export function NetworkFilters({
  categories,
  nodeRoles,
  hideTypeFilter = false,
}: NetworkFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "ALL";
  const currentCategory = searchParams.get("category") || "All";
  const currentRole = searchParams.get("role") || "All";
  const currentSort = searchParams.get("sort") || "featured";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All" && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset page when filters change
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetAll = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    searchParams.has("q") ||
    searchParams.has("type") ||
    searchParams.has("category") ||
    searchParams.has("role") ||
    searchParams.has("sort");

  return (
    <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
          <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter & Sort
        </span>
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={resetAll}
            leftIcon={<RotateCcw className="w-3 h-3 text-slate-400" />}
            className="text-[11px] h-7 px-2"
          >
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Network Type Filter */}
        {!hideTypeFilter && (
          <Select
            label="Network Type"
            value={currentType}
            onChange={(e) => updateParam("type", e.target.value)}
            options={[
              { value: "ALL", label: "All Network Types" },
              { value: "MAINNET", label: "Mainnet Only" },
              { value: "TESTNET", label: "Testnet Only" },
            ]}
          />
        )}

        {/* Category / Architecture Filter */}
        <Select
          label="Architecture Category"
          value={currentCategory}
          onChange={(e) => updateParam("category", e.target.value)}
          options={[
            { value: "All", label: "All Architectures" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />

        {/* Node Role Filter */}
        <Select
          label="Supported Node Role"
          value={currentRole}
          onChange={(e) => updateParam("role", e.target.value)}
          options={[
            { value: "All", label: "All Node Roles" },
            ...nodeRoles.map((r) => ({ value: r, label: r })),
          ]}
        />

        {/* Sort Order */}
        <Select
          label="Sort Results"
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          options={[
            { value: "featured", label: "Featured First" },
            { value: "name_asc", label: "Name (A to Z)" },
            { value: "name_desc", label: "Name (Z to A)" },
            { value: "newest", label: "Recently Added" },
          ]}
        />
      </div>
    </div>
  );
}
