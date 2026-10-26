"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cpu, Activity, HardDrive, Calculator, ArrowRight, Gauge } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CapacityPreset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  cpu: string;
  ram: string;
  disk: string;
  growth: string;
  bandwidth: string;
}

const CAPACITY_PRESETS: CapacityPreset[] = [
  {
    id: "ethereum",
    name: "Ethereum Mainnet",
    symbol: "ETH",
    type: "Geth + Lighthouse Full Node",
    cpu: "8 cores / 16 threads (3.2GHz+)",
    ram: "32 GB DDR4 / DDR5",
    disk: "2 TB NVMe SSD (PCIe 4.0)",
    growth: "~18 - 25 GB / month",
    bandwidth: "50 Mbps sustained (unmetered)",
  },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    symbol: "ARB",
    type: "Nitro Execution Node",
    cpu: "8 cores (Fast Single-Thread)",
    ram: "32 GB ECC RAM",
    disk: "3 TB NVMe (Read IOPS 50k+)",
    growth: "~30 - 45 GB / month",
    bandwidth: "100 Mbps burst capable",
  },
  {
    id: "base",
    name: "Base Mainnet",
    symbol: "BASE",
    type: "OP-Geth Rollup Replica",
    cpu: "8 cores / 16 threads",
    ram: "16 - 32 GB RAM",
    disk: "1 TB NVMe SSD",
    growth: "~15 - 20 GB / month",
    bandwidth: "40 Mbps sustained",
  },
  {
    id: "solana",
    name: "Solana Mainnet",
    symbol: "SOL",
    type: "Agave Validator Node",
    cpu: "12 cores / 24 threads (3.5GHz+)",
    ram: "128 - 256 GB RAM",
    disk: "2x 2 TB NVMe (OS + Accounts)",
    growth: "~100+ GB / month (ledger)",
    bandwidth: "1 Gbps symmetrical",
  },
];

export function HomeCapacityWidget() {
  const [selected, setSelected] = useState<CapacityPreset>(CAPACITY_PRESETS[0]);

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#070b16] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
      {/* Ambient background glow */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left: Info & Preset Picker */}
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Node Sizing Calculator</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Plan Hardware &amp; Operational Costs
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            Select a target network to review empirical storage growth trajectories, memory baselines, and IOPS requirements before provisioning VPS or Bare Metal infrastructure.
          </p>

          {/* Interactive Network Selectors */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {CAPACITY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelected(preset)}
                aria-label={`Select ${preset.name} hardware capacity preset`}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  selected.id === preset.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                    : "bg-[#0b101d] text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Calculation Metrics Card */}
        <div className="w-full lg:w-96 rounded-xl bg-[#04060c] border border-slate-800/90 p-5 font-mono text-xs space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-semibold text-white font-sans">{selected.name}</span>
            <span className="text-cyan-400 text-[11px] font-bold">{selected.symbol}</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Core:
              </span>
              <span className="text-white text-right">{selected.cpu}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> System RAM:
              </span>
              <span className="text-white text-right">{selected.ram}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-violet-400" /> Min Storage:
              </span>
              <span className="text-white text-right">{selected.disk}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" /> State Growth:
              </span>
              <span className="text-emerald-400 font-semibold text-right">{selected.growth}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <Link href="/tools">
              <Button size="sm" variant="primary" className="w-full justify-center" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Launch Full Planning Calculators
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
