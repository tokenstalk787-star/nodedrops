"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NetworkSearchProps {
  className?: string;
  placeholder?: string;
}

export function NetworkSearch({
  className,
  placeholder = "Search networks by name, symbol, consensus, or client...",
}: NetworkSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [term, setTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (newTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newTerm.trim()) {
      params.set("q", newTerm.trim());
    } else {
      params.delete("q");
    }
    params.delete("page"); // Reset page when query changes
    const basePath = pathname || "/networks";
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(term);
  };

  const handleClear = () => {
    setTerm("");
    handleSearch("");
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative flex items-center w-full", className)}
    >
      <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>

      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search networks"
        className={cn(
          "w-full rounded-xl bg-[#0e1424] text-slate-100 text-sm border border-slate-700/80 pl-10 pr-20 py-2.5 transition-colors placeholder:text-slate-500",
          "focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50",
          "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        )}
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {term.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-200 rounded focus:outline-none"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="text-xs font-semibold px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
