"use client";

import React, { useState } from "react";
import { HardDrive, ShieldAlert, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormulaCard } from "./FormulaCard";
import { DisclaimerNotice } from "./DisclaimerNotice";

export function StorageCalculatorTool() {
  const [initialSize, setInitialSize] = useState<string>("850");
  const [monthlyGrowth, setMonthlyGrowth] = useState<string>("35");
  const [osBuffer, setOsBuffer] = useState<string>("50");
  const [pruningMode, setPruningMode] = useState<"none" | "6months" | "12months">("none");
  const [horizonMonths, setHorizonMonths] = useState<number>(12);

  // Validation
  const initNum = parseFloat(initialSize);
  const growthNum = parseFloat(monthlyGrowth);
  const bufferNum = parseFloat(osBuffer);

  const errors: Record<string, string> = {};
  if (isNaN(initNum) || initNum <= 0) errors.initial = "Initial state must be greater than 0 GB.";
  if (isNaN(growthNum) || growthNum < 0) errors.growth = "Monthly growth must be 0 or a positive number (GB/month).";
  if (isNaN(bufferNum) || bufferNum < 0) errors.buffer = "System buffer must be 0 or greater (GB).";

  // Calculation projection helper
  const calculateStorageAtMonth = (m: number) => {
    if (isNaN(initNum) || isNaN(growthNum) || isNaN(bufferNum)) return 0;

    if (pruningMode === "none") {
      return Math.round(initNum + growthNum * m + bufferNum);
    }

    const pruneInterval = pruningMode === "6months" ? 6 : 12;
    const cycles = Math.floor(m / pruneInterval);
    const monthsSincePrune = m % pruneInterval;
    // Each prune saves ~60% of accumulated growth
    const prunedBase = initNum + growthNum * (cycles * 0.4 * pruneInterval);
    return Math.round(prunedBase + growthNum * monthsSincePrune + bufferNum);
  };

  const projectedNow = calculateStorageAtMonth(0);
  const projected3mo = calculateStorageAtMonth(3);
  const projected6mo = calculateStorageAtMonth(6);
  const projected12mo = calculateStorageAtMonth(12);
  const projected24mo = calculateStorageAtMonth(24);
  const targetProjected = calculateStorageAtMonth(horizonMonths);

  // Recommended Drive Capacity with 20% SSD provisioning headroom
  // Formula: Drive >= Projected / 0.80
  const requiredWithHeadroom = Math.round(targetProjected / 0.8);
  let recommendedDrive = "2 TB (2,000 GB)";
  let driveSizeGb = 2000;
  if (requiredWithHeadroom > 4000) {
    recommendedDrive = "8 TB (8,000 GB NVMe)";
    driveSizeGb = 8000;
  } else if (requiredWithHeadroom > 2000) {
    recommendedDrive = "4 TB (4,000 GB NVMe)";
    driveSizeGb = 4000;
  } else if (requiredWithHeadroom <= 1000) {
    recommendedDrive = "1 TB (1,000 GB NVMe)";
    driveSizeGb = 1000;
  }

  const fillPercentage = Math.min(100, Math.round((targetProjected / driveSizeGb) * 100));

  const handlePreset = (type: "eth-full" | "arb-nitro" | "archive") => {
    if (type === "eth-full") {
      setInitialSize("850");
      setMonthlyGrowth("35");
      setOsBuffer("50");
      setPruningMode("12months");
    } else if (type === "arb-nitro") {
      setInitialSize("1800");
      setMonthlyGrowth("65");
      setOsBuffer("60");
      setPruningMode("none");
    } else if (type === "archive") {
      setInitialSize("14500");
      setMonthlyGrowth("220");
      setOsBuffer("100");
      setPruningMode("none");
    }
  };

  return (
    <div className="space-y-8">
      {/* Tool Introduction */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <HardDrive className="w-6 h-6 text-cyan-400" />
          <span>Blockchain State &amp; Storage Growth Estimator</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Model chain state expansion, compare pruned vs archive growth trajectories, and determine optimal NVMe SSD purchase sizing with wear-leveling reserves.
        </p>
      </div>

      {/* Preset Quick Fill */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 font-mono flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Quick Profiles:
        </span>
        <Button size="sm" variant="ghost" onClick={() => handlePreset("eth-full")}>
          Ethereum Full Node (Geth)
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handlePreset("arb-nitro")}>
          Arbitrum Nitro L2
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handlePreset("archive")}>
          Archive Node Profile
        </Button>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-5 p-5 rounded-2xl border border-slate-800 bg-[#070b16]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
            Storage Sizing Parameters
          </h3>

          {/* Initial State Size */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200">Initial Snapshot / Current State (GB)</label>
              <span className="text-slate-400 font-mono">Unit: Gigabytes (GB)</span>
            </div>
            <input
              type="number"
              min="10"
              max="50000"
              value={initialSize}
              onChange={(e) => setInitialSize(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.initial && <p className="text-xs text-rose-400">{errors.initial}</p>}
          </div>

          {/* Monthly Growth Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200">Projected Monthly Chain Growth (GB/month)</label>
              <span className="text-slate-400 font-mono">Unit: GB / month</span>
            </div>
            <input
              type="number"
              min="0"
              max="2000"
              value={monthlyGrowth}
              onChange={(e) => setMonthlyGrowth(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.growth && <p className="text-xs text-rose-400">{errors.growth}</p>}
          </div>

          {/* OS & Logs Buffer */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200">OS, Swap &amp; System Logs Reserve (GB)</label>
              <span className="text-slate-400 font-mono">Recommended: 50 GB</span>
            </div>
            <input
              type="number"
              min="10"
              max="500"
              value={osBuffer}
              onChange={(e) => setOsBuffer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.buffer && <p className="text-xs text-rose-400">{errors.buffer}</p>}
          </div>

          {/* Pruning Strategy */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">State Pruning Policy</label>
            <select
              value={pruningMode}
              onChange={(e) => setPruningMode(e.target.value as "none" | "6months" | "12months")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="none">No Pruning / Archive Retention (Continuous Growth)</option>
              <option value="12months">Annual Pruning Cycle (Prune ancient states every 12 months)</option>
              <option value="6months">Aggressive Pruning Cycle (Prune state every 6 months)</option>
            </select>
          </div>

          {/* Planning Horizon Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-semibold text-slate-200">Planning Horizon:</span>
              <span className="text-cyan-400 font-bold">{horizonMonths} Months</span>
            </div>
            <input
              type="range"
              min="3"
              max="36"
              step="3"
              value={horizonMonths}
              onChange={(e) => setHorizonMonths(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>3 Mo</span>
              <span>12 Mo (1 Yr)</span>
              <span>24 Mo (2 Yrs)</span>
              <span>36 Mo (3 Yrs)</span>
            </div>
          </div>
        </div>

        {/* Right Output Projections */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Projection Summary</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {targetProjected.toLocaleString()} <span className="text-lg text-cyan-400">GB</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">at Month {horizonMonths}</span>
              </div>
            </div>

            {/* Recommended Hardware Purchase Card */}
            <div className="p-4 rounded-xl bg-[#0b101d] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                  Recommended Physical Drive
                </span>
                <Badge variant="cyan" size="sm">
                  20% Provisioning Buffer
                </Badge>
              </div>
              <div className="text-xl font-bold text-white">{recommendedDrive}</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Projected to utilize <strong>{targetProjected} GB</strong> ({fillPercentage}% capacity) at month {horizonMonths}, maintaining the essential 20% unallocated partition for wear-leveling.
              </p>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-500 ${
                    fillPercentage > 85 ? "bg-rose-500" : fillPercentage > 70 ? "bg-amber-400" : "bg-cyan-400"
                  }`}
                  style={{ width: `${Math.min(100, fillPercentage)}%` }}
                />
              </div>
            </div>

            {/* Time Horizon Breakdown Table */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Growth Timeline</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#0b101d] border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Today (0 Mo)</span>
                  <span className="text-white font-bold">{projectedNow} GB</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b101d] border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">3 Months</span>
                  <span className="text-white font-bold">{projected3mo} GB</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b101d] border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">6 Months</span>
                  <span className="text-cyan-300 font-bold">{projected6mo} GB</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b101d] border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">12 Months</span>
                  <span className="text-cyan-300 font-bold">{projected12mo} GB</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b101d] border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">24 Months</span>
                  <span className="text-cyan-400 font-bold">{projected24mo} GB</span>
                </div>
              </div>
            </div>

            {/* SSD Write Endurance Notice */}
            <div className="p-3.5 rounded-xl bg-[#090d19] border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>NVMe Endurance &amp; TBW Consideration:</span>
              </div>
              <p className="leading-relaxed">
                Modern Ethereum execution clients write up to 10–20 TBW per month in state trie modifications. Select TLC NVMe drives rated for at least 1,200 TBW (e.g. Samsung 990 Pro, Kingston KC3000, WD Black SN850X).
              </p>
            </div>
          </div>

          <DisclaimerNotice toolName="Storage Calculator" />
        </div>
      </div>

      {/* Formula & Computation Logic Card */}
      <FormulaCard
        formula="Total Storage (t) = Initial_Size + (Monthly_Growth × t) + OS_Buffer"
        variables={[
          { name: "Initial_Size", description: "Current blockchain database size at genesis or snapshot height", unit: "GB" },
          { name: "Monthly_Growth", description: "Historical or anticipated chain state expansion per 30-day period", unit: "GB/month" },
          { name: "t", description: "Planning horizon in months", unit: "Months" },
          { name: "OS_Buffer", description: "Allocation reserved for root filesystem, swapfile, and journal logs", unit: "GB" },
        ]}
        assumptions={[
          "Assumes constant linear monthly state expansion. In reality, state growth fluctuates with transaction activity.",
          "Recommended drive sizes round up to standard commercial sizes (1 TB, 2 TB, 4 TB, 8 TB).",
          "Calculations enforce a 20% unallocated partition buffer to maintain NVMe TRIM performance.",
        ]}
      />
    </div>
  );
}
