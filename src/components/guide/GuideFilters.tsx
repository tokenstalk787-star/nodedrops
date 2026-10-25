"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export interface GuideFiltersProps {
  categories: { name: string; slug: string }[];
  networks: { name: string; slug: string }[];
}

export function GuideFilters({ categories, networks }: GuideFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentDifficulty = searchParams.get("difficulty") || "All";
  const currentNetwork = searchParams.get("network") || "All";
  const currentCategory = searchParams.get("category") || "All";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetAll = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    searchParams.has("q") ||
    searchParams.has("difficulty") ||
    searchParams.has("network") ||
    searchParams.has("category");

  return (
    <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
          <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Runbooks
        </span>
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={resetAll}
            leftIcon={<RotateCcw className="w-3 h-3 text-slate-400" />}
            className="text-[11px] h-7 px-2"
          >
            Reset Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          label="Difficulty Level"
          value={currentDifficulty}
          onChange={(e) => updateParam("difficulty", e.target.value)}
          options={[
            { value: "All", label: "All Difficulties" },
            { value: "BEGINNER", label: "Beginner" },
            { value: "INTERMEDIATE", label: "Intermediate" },
            { value: "ADVANCED", label: "Advanced" },
          ]}
        />

        <Select
          label="Target Blockchain"
          value={currentNetwork}
          onChange={(e) => updateParam("network", e.target.value)}
          options={[
            { value: "All", label: "All Networks" },
            ...networks.map((n) => ({ value: n.slug, label: n.name })),
          ]}
        />

        <Select
          label="Node Role Category"
          value={currentCategory}
          onChange={(e) => updateParam("category", e.target.value)}
          options={[
            { value: "All", label: "All Categories" },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
        />
      </div>
    </div>
  );
}
