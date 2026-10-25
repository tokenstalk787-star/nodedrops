"use client";

import React, { useState } from "react";
import { Cpu, Activity, HardDrive, Network as NetworkIcon, CheckCircle2, AlertTriangle, XCircle, Info, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormulaCard } from "./FormulaCard";
import { DisclaimerNotice } from "./DisclaimerNotice";

interface NetworkPreset {
  id: string;
  name: string;
  role: string;
  minCpu: number;
  recCpu: number;
  minRamGb: number;
  recRamGb: number;
  minStorageGb: number;
  recStorageGb: number;
  minBandwidthMbps: number;
  sourceDoc: string;
}

const NETWORK_PRESETS: NetworkPreset[] = [
  {
    id: "eth-mainnet",
    name: "Ethereum Mainnet",
    role: "Full Node (Geth + Lighthouse)",
    minCpu: 4,
    recCpu: 8,
    minRamGb: 16,
    recRamGb: 32,
    minStorageGb: 2000,
    recStorageGb: 4000,
    minBandwidthMbps: 100,
    sourceDoc: "Ethereum.org Official Hardware Specifications (2026)",
  },
  {
    id: "arbitrum-one",
    name: "Arbitrum One",
    role: "Nitro Full Node (Docker)",
    minCpu: 8,
    recCpu: 16,
    minRamGb: 32,
    recRamGb: 64,
    minStorageGb: 3000,
    recStorageGb: 4000,
    minBandwidthMbps: 100,
    sourceDoc: "Offchain Labs Arbitrum Nitro Deployment Documentation",
  },
  {
    id: "base-mainnet",
    name: "Base Mainnet",
    role: "Dedicated RPC (op-geth + op-node)",
    minCpu: 8,
    recCpu: 16,
    minRamGb: 32,
    recRamGb: 64,
    minStorageGb: 2000,
    recStorageGb: 4000,
    minBandwidthMbps: 100,
    sourceDoc: "Base Official Node Documentation (OP Stack)",
  },
  {
    id: "solana-mainnet",
    name: "Solana Mainnet-Beta",
    role: "Non-Voting RPC Node (Agave)",
    minCpu: 16,
    recCpu: 32,
    minRamGb: 128,
    recRamGb: 256,
    minStorageGb: 2000,
    recStorageGb: 4000,
    minBandwidthMbps: 1000,
    sourceDoc: "Solana Labs Official Validator & RPC Hardware Requirements",
  },
  {
    id: "holesky-testnet",
    name: "Holesky Testnet",
    role: "Proof-of-Stake Validator",
    minCpu: 4,
    recCpu: 8,
    minRamGb: 16,
    recRamGb: 32,
    minStorageGb: 500,
    recStorageGb: 1000,
    minBandwidthMbps: 50,
    sourceDoc: "Ethereum Holesky Testnet Validator Documentation",
  },
];

export function HardwareChecklistTool() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("eth-mainnet");
  const selectedPreset = NETWORK_PRESETS.find((p) => p.id === selectedPresetId) || NETWORK_PRESETS[0];

  // User input states
  const [userCpu, setUserCpu] = useState<string>("8");
  const [userRam, setUserRam] = useState<string>("32");
  const [userStorage, setUserStorage] = useState<string>("2000");
  const [userDiskType, setUserDiskType] = useState<"nvme" | "sata-ssd" | "hdd">("nvme");
  const [userBandwidth, setUserBandwidth] = useState<string>("300");

  // Validation
  const cpuNum = parseFloat(userCpu);
  const ramNum = parseFloat(userRam);
  const storageNum = parseFloat(userStorage);
  const bandwidthNum = parseFloat(userBandwidth);

  const errors: Record<string, string> = {};
  if (isNaN(cpuNum) || cpuNum <= 0) errors.cpu = "CPU cores must be a positive integer.";
  if (isNaN(ramNum) || ramNum <= 0) errors.ram = "Memory RAM must be a positive number (GB).";
  if (isNaN(storageNum) || storageNum <= 0) errors.storage = "Storage capacity must be a positive number (GB).";
  if (isNaN(bandwidthNum) || bandwidthNum <= 0) errors.bandwidth = "Bandwidth must be a positive number (Mbps).";

  // Evaluation logic
  const getStatus = (val: number, min: number, rec: number) => {
    if (isNaN(val) || val < min) return "fail";
    if (val < rec) return "warn";
    return "pass";
  };

  const cpuStatus = getStatus(cpuNum, selectedPreset.minCpu, selectedPreset.recCpu);
  const ramStatus = getStatus(ramNum, selectedPreset.minRamGb, selectedPreset.recRamGb);
  const storageCapacityStatus = getStatus(storageNum, selectedPreset.minStorageGb, selectedPreset.recStorageGb);
  const storageStatus = userDiskType === "hdd" ? "fail" : storageCapacityStatus;
  const bandwidthStatus = getStatus(bandwidthNum, selectedPreset.minBandwidthMbps, selectedPreset.minBandwidthMbps * 1.5);

  const allStatuses = [cpuStatus, ramStatus, storageStatus, bandwidthStatus];
  const hasFail = allStatuses.includes("fail");
  const hasWarn = allStatuses.includes("warn");

  let overallScore = 100;
  if (hasFail) overallScore = 35;
  else if (hasWarn) overallScore = 75;

  const handleApplyRecommended = () => {
    setUserCpu(String(selectedPreset.recCpu));
    setUserRam(String(selectedPreset.recRamGb));
    setUserStorage(String(selectedPreset.recStorageGb));
    setUserDiskType("nvme");
    setUserBandwidth(String(Math.max(selectedPreset.minBandwidthMbps * 2, 250)));
  };

  return (
    <div className="space-y-8">
      {/* Tool Introduction */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-6 h-6 text-cyan-400" />
          <span>Hardware Compatibility &amp; Readiness Checklist</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Evaluate whether your target machine (home lab, bare-metal server, or cloud VPS) meets verified minimum and recommended node operating specifications.
        </p>
      </div>

      {/* Network Preset Selector */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider font-mono">
            Select Documented Target Network:
          </label>
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />} onClick={handleApplyRecommended}>
            Auto-fill Recommended Specs
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NETWORK_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedPresetId(preset.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedPresetId === preset.id
                  ? "bg-cyan-500/10 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : "bg-[#0b101d] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="text-sm font-bold text-white">{preset.name}</div>
              <div className="text-xs text-cyan-400/80 font-mono mt-0.5">{preset.role}</div>
              <div className="mt-2 text-[11px] text-slate-400 font-mono">
                Min: {preset.minCpu}C / {preset.minRamGb}GB / {preset.minStorageGb}GB
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            Documented Source: <strong className="text-slate-300">{selectedPreset.sourceDoc}</strong>
          </span>
        </div>
      </div>

      {/* Main Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: User Inputs */}
        <div className="lg:col-span-6 space-y-5 p-5 rounded-2xl border border-slate-800 bg-[#070b16]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
            Enter Your Machine Specifications
          </h3>

          {/* CPU Cores */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Processor Cores (Physical or vCPU)</span>
              </label>
              <span className="text-slate-400 font-mono">Min: {selectedPreset.minCpu} | Rec: {selectedPreset.recCpu} Cores</span>
            </div>
            <input
              type="number"
              min="1"
              max="256"
              value={userCpu}
              onChange={(e) => setUserCpu(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.cpu && <p className="text-xs text-rose-400">{errors.cpu}</p>}
          </div>

          {/* System RAM */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>Memory (RAM in GB)</span>
              </label>
              <span className="text-slate-400 font-mono">Min: {selectedPreset.minRamGb} GB | Rec: {selectedPreset.recRamGb} GB</span>
            </div>
            <input
              type="number"
              min="1"
              max="2048"
              value={userRam}
              onChange={(e) => setUserRam(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.ram && <p className="text-xs text-rose-400">{errors.ram}</p>}
          </div>

          {/* Storage Capacity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-violet-400" />
                <span>Storage Disk Capacity (GB)</span>
              </label>
              <span className="text-slate-400 font-mono">Min: {selectedPreset.minStorageGb} GB | Rec: {selectedPreset.recStorageGb} GB</span>
            </div>
            <input
              type="number"
              min="100"
              max="100000"
              value={userStorage}
              onChange={(e) => setUserStorage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.storage && <p className="text-xs text-rose-400">{errors.storage}</p>}
          </div>

          {/* Storage Media Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Storage Media Type &amp; Interface</label>
            <select
              value={userDiskType}
              onChange={(e) => setUserDiskType(e.target.value as "nvme" | "sata-ssd" | "hdd")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="nvme">NVMe SSD (PCIe 3.0 / 4.0 / 5.0) — Recommended</option>
              <option value="sata-ssd">SATA SSD (500 MB/s IOPS bottleneck on sync)</option>
              <option value="hdd">Mechanical Hard Drive (HDD) — Incompatible</option>
            </select>
          </div>

          {/* Network Bandwidth */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <NetworkIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Internet Connection Speed (Mbps)</span>
              </label>
              <span className="text-slate-400 font-mono">Min: {selectedPreset.minBandwidthMbps} Mbps</span>
            </div>
            <input
              type="number"
              min="1"
              max="100000"
              value={userBandwidth}
              onChange={(e) => setUserBandwidth(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.bandwidth && <p className="text-xs text-rose-400">{errors.bandwidth}</p>}
          </div>
        </div>

        {/* Right Column: Readiness Assessment Report */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">System Compatibility</span>
                <h4 className="text-lg font-bold text-white">Pre-Deployment Readiness</h4>
              </div>

              <Badge
                variant={overallScore === 100 ? "success" : overallScore >= 70 ? "warning" : "error"}
                size="md"
              >
                {overallScore === 100 ? "100% Ready (Recommended)" : overallScore >= 70 ? "Meets Minimum Only" : "Critical Hardware Deficit"}
              </Badge>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3 text-xs sm:text-sm">
              {/* CPU Evaluation */}
              <div className="p-3 rounded-xl bg-[#0b101d] border border-slate-800/80 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>CPU: {userCpu || 0} Cores</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {cpuStatus === "pass"
                      ? "Exceeds recommended CPU specification for consensus and execution loops."
                      : cpuStatus === "warn"
                      ? "Meets minimum core threshold, but sync times and block validation may lag under peak traffic."
                      : `Inadequate CPU cores. Documented minimum is ${selectedPreset.minCpu} cores.`}
                  </p>
                </div>
                {cpuStatus === "pass" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : cpuStatus === "warn" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </div>

              {/* RAM Evaluation */}
              <div className="p-3 rounded-xl bg-[#0b101d] border border-slate-800/80 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span>RAM: {userRam || 0} GB</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {ramStatus === "pass"
                      ? "Ample memory cache for execution state database and beacon attestations."
                      : ramStatus === "warn"
                      ? "Meets minimum requirements. Configure a 8 GB swapfile to mitigate potential Out-Of-Memory (OOM) client panics."
                      : `Insufficient memory. Machine will likely crash from kernel OOM killer (Minimum: ${selectedPreset.minRamGb} GB).`}
                  </p>
                </div>
                {ramStatus === "pass" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : ramStatus === "warn" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </div>

              {/* Storage Evaluation */}
              <div className="p-3 rounded-xl bg-[#0b101d] border border-slate-800/80 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-violet-400" />
                    <span>Disk: {userStorage || 0} GB ({userDiskType.toUpperCase()})</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {userDiskType === "hdd"
                      ? "CRITICAL ERROR: Mechanical HDDs cannot achieve the 10,000+ random IOPS required by LevelDB/PebbleDB."
                      : storageStatus === "pass"
                      ? "NVMe storage capacity is sufficient for initial state snapshot plus 12+ months growth buffer."
                      : storageStatus === "warn"
                      ? "Meets initial disk requirement, but will require state pruning within 3 to 6 months."
                      : `Storage capacity insufficient for initial chain snapshot (Minimum: ${selectedPreset.minStorageGb} GB).`}
                  </p>
                </div>
                {storageStatus === "pass" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : storageStatus === "warn" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </div>

              {/* Bandwidth Evaluation */}
              <div className="p-3 rounded-xl bg-[#0b101d] border border-slate-800/80 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <NetworkIcon className="w-4 h-4 text-emerald-400" />
                    <span>Bandwidth: {userBandwidth || 0} Mbps</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {bandwidthStatus === "pass"
                      ? "Symmetric bandwidth comfortably handles peer propagation and sync."
                      : "Bandwidth meets minimum but may experience delayed attestation gossip during network reorganizations."}
                  </p>
                </div>
                {bandwidthStatus === "pass" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                )}
              </div>
            </div>
          </div>

          <DisclaimerNotice toolName="Hardware Sizing Checklist" />
        </div>
      </div>

      {/* Formula & Calculation Card */}
      <FormulaCard
        formula="Readiness Score = (CPU_Score × 0.25) + (RAM_Score × 0.30) + (Storage_Score × 0.35) + (Network_Score × 0.10)"
        variables={[
          { name: "CPU_Score", description: "Ratio of user cores to documented minimum and recommended baselines", unit: "Cores" },
          { name: "RAM_Score", description: "Available physical system memory against client buffer thresholds", unit: "GB" },
          { name: "Storage_Score", description: "Disk capacity and drive IOPS suitability (NVMe vs SATA vs HDD)", unit: "GB / IOPS" },
          { name: "Network_Score", description: "Symmetric upstream and downstream throughput", unit: "Mbps" },
        ]}
        assumptions={[
          "Requirements reflect standard full node clients (not archive nodes which require 14+ TB).",
          "HDDs are considered 100% incompatible due to latency bounds for state trie reads.",
          "Documented values are sourced directly from official network client repositories.",
        ]}
      />
    </div>
  );
}
