"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { NetworkCard, NetworkWithRelations } from "@/components/network/NetworkCard";

interface InteractiveNetworkShowcaseProps {
  initialNetworks: NetworkWithRelations[];
}

export function InteractiveNetworkShowcase({
  initialNetworks,
}: InteractiveNetworkShowcaseProps) {
  const [filterTab, setFilterTab] = useState<"ALL" | "MAINNET" | "TESTNET" | "ROLLUP">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNetworks = useMemo(() => {
    return initialNetworks.filter((net) => {
      // Type filter
      if (filterTab === "MAINNET" && net.networkType !== "MAINNET") return false;
      if (filterTab === "TESTNET" && net.networkType !== "TESTNET") return false;
      if (filterTab === "ROLLUP" && !net.category.toLowerCase().includes("rollup") && !net.layer.toLowerCase().includes("layer 2")) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = net.name.toLowerCase().includes(q);
        const matchesSymbol = net.symbol.toLowerCase().includes(q);
        const matchesConsensus = net.consensus.toLowerCase().includes(q);
        const matchesLayer = net.layer.toLowerCase().includes(q);
        if (!matchesName && !matchesSymbol && !matchesConsensus && !matchesLayer) {
          return false;
        }
      }

      return true;
    });
  }, [initialNetworks, filterTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Dynamic Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#070b16] border border-slate-800/90 shadow-xl">
        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterTab("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono transition-all whitespace-nowrap ${
              filterTab === "ALL"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            All Networks ({initialNetworks.length})
          </button>

          <button
            onClick={() => setFilterTab("MAINNET")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono transition-all whitespace-nowrap ${
              filterTab === "MAINNET"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            Mainnets ({initialNetworks.filter((n) => n.networkType === "MAINNET").length})
          </button>

          <button
            onClick={() => setFilterTab("TESTNET")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono transition-all whitespace-nowrap ${
              filterTab === "TESTNET"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            Testnets ({initialNetworks.filter((n) => n.networkType === "TESTNET").length})
          </button>

          <button
            onClick={() => setFilterTab("ROLLUP")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono transition-all whitespace-nowrap ${
              filterTab === "ROLLUP"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            Rollups / L2
          </button>
        </div>

        {/* Live Filter Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick filter chains..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#04060c] border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Network Cards Grid */}
      {filteredNetworks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNetworks.map((net) => (
            <NetworkCard key={net.id} network={net} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 p-6 rounded-2xl bg-[#070b16] border border-slate-800 text-slate-400 space-y-3">
          <p className="text-sm">No networks matched your filter criteria.</p>
          <button
            onClick={() => {
              setFilterTab("ALL");
              setSearchQuery("");
            }}
            className="text-xs text-cyan-400 hover:underline font-mono"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
