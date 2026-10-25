"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const POPULAR_SUGGESTIONS = [
  "Ethereum",
  "Solana",
  "Validator",
  "Arbitrum Nitro",
  "RPC Node",
  "Base",
  "Holesky",
  "Geth",
];

export interface SearchInputProps {
  initialQuery?: string;
  className?: string;
}

export function SearchInput({ initialQuery = "", className }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname() || "/search";
  const searchParams = useSearchParams();

  const [term, setTerm] = useState(initialQuery);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if URL search query changes externally
  useEffect(() => {
    setTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const updateSearchQuery = (newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = newQuery.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    params.delete("page"); // Reset page on new query
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTerm(val);

    // Debounce 350ms
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateSearchQuery(val);
    }, 350);
  };

  const handleClear = () => {
    setTerm("");
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updateSearchQuery("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTerm(suggestion);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updateSearchQuery(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updateSearchQuery(term);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <form onSubmit={handleSubmit} className="relative flex items-center group">
        <div className="absolute left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>

        <input
          type="search"
          value={term}
          onChange={handleChange}
          placeholder="Search networks, deployment runbooks, clients, or node roles..."
          aria-label="Global search query"
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#070b16] border border-slate-800 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
        />

        {term && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            className="absolute right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Suggested Search Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Popular:</span>
        </span>
        {POPULAR_SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleSuggestionClick(item)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 text-slate-300 transition-all font-mono text-[11px]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
