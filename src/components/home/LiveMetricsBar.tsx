import React from "react";
import { Server, FileText, Cpu, ShieldCheck, Database, BookOpen } from "lucide-react";

interface LiveMetricsBarProps {
  networksCount: number;
  guidesCount: number;
  clientsCount: number;
  sourcesCount: number;
}

export function LiveMetricsBar({
  networksCount,
  guidesCount,
  clientsCount,
  sourcesCount,
}: LiveMetricsBarProps) {
  return (
    <div className="w-full border-y border-cyan-500/20 bg-gradient-to-r from-[#070b16] via-[#091024] to-[#070b16] py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        {/* Left: Real-time Cloud Indicator */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-white font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>TiDB Cloud Serverless</span>
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Live State Synchronized</span>
        </div>

        {/* Right: Real Platform Database Metrics */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">{networksCount}</span>
            <span className="text-slate-400">Chains Monitored</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-white">{guidesCount}</span>
            <span className="text-slate-400">Official Runbooks</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 hidden md:flex">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-bold text-white">{clientsCount}</span>
            <span className="text-slate-400">Client Engines</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 hidden lg:flex">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-white">{sourcesCount}</span>
            <span className="text-slate-400">Upstream Sources</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium text-[11px]">100% Non-Commercial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
