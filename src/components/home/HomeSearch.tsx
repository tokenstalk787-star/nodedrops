"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HomeSearchProps {
  className?: string;
}

export function HomeSearch({ className }: HomeSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K focus shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/networks?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/networks");
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    router.push(`/networks?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-3", className)}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className="relative flex items-center group"
      >
        <div className="absolute left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by network, client (Geth, Lighthouse), or node type..."
          aria-label="Search blockchain networks and node guides"
          className={cn(
            "w-full rounded-2xl bg-[#0e1424]/90 backdrop-blur-md text-slate-100 text-sm sm:text-base border border-slate-700/80 pl-12 pr-28 py-3.5 sm:py-4 transition-all placeholder:text-slate-500 shadow-xl",
            "focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:bg-[#11182c]",
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          )}
        />

        <div className="absolute right-3 flex items-center gap-2">
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-200 rounded focus:outline-none"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <kbd
            className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 rounded border border-slate-700/80 select-none pointer-events-none"
            aria-hidden="true"
          >
            ⌘K
          </kbd>

          <button
            type="submit"
            className="inline-flex items-center justify-center p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Submit search"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggested Search Quick Filters */}
      <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-slate-400">
        <span className="text-slate-500 select-none">Popular:</span>
        {["Ethereum", "Arbitrum", "Solana", "Holesky Testnet", "Validator"].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => handleChipClick(term)}
            className="px-2.5 py-1 rounded-full bg-[#101729] hover:bg-[#18233e] text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors select-none"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
