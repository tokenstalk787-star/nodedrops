"use client";

import React, { useState } from "react";
import { Network, AlertTriangle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormulaCard } from "./FormulaCard";
import { DisclaimerNotice } from "./DisclaimerNotice";

export function BandwidthCalculatorTool() {
  const [peerCount, setPeerCount] = useState<string>("50");
  const [ratePerPeer, setRatePerPeer] = useState<string>("15");
  const [rpcQps, setRpcQps] = useState<string>("0");
  const [rpcPayloadKb, setRpcPayloadKb] = useState<string>("4");
  const [burstFactor, setBurstFactor] = useState<string>("1.5");

  // Validation
  const peersNum = parseFloat(peerCount);
  const rateNum = parseFloat(ratePerPeer);
  const qpsNum = parseFloat(rpcQps);
  const payloadNum = parseFloat(rpcPayloadKb);
  const burstNum = parseFloat(burstFactor);

  const errors: Record<string, string> = {};
  if (isNaN(peersNum) || peersNum < 5) errors.peers = "Peer count must be at least 5 peers.";
  if (isNaN(rateNum) || rateNum < 0) errors.rate = "Data rate per peer must be a positive number (KB/s).";
  if (isNaN(qpsNum) || qpsNum < 0) errors.qps = "RPC queries/sec must be 0 or positive.";
  if (isNaN(payloadNum) || payloadNum <= 0) errors.payload = "Average payload must be greater than 0 KB.";
  if (isNaN(burstNum) || burstNum < 1) errors.burst = "Burst factor must be at least 1.0.";

  // Calculations
  const p2pMbPerSec = !errors.peers && !errors.rate ? (peersNum * rateNum) / 1024 : 0;
  const rpcMbPerSec = !errors.qps && !errors.payload ? (qpsNum * payloadNum) / 1024 : 0;
  const totalMbPerSec = p2pMbPerSec + rpcMbPerSec;

  const sustainedMbps = totalMbPerSec * 8;
  const recommendedMbps = sustainedMbps * (isNaN(burstNum) ? 1.5 : burstNum);

  // 730 hours per average month
  const monthlySeconds = 730 * 3600;
  const monthlyTransferGb = (totalMbPerSec * monthlySeconds) / 1024;
  const monthlyTransferTb = monthlyTransferGb / 1024;

  const exceedsTypicalDataCap = monthlyTransferTb > 1.2;

  const handleApplyPreset = (mode: "validator" | "rpc-dapp" | "heavy-node") => {
    if (mode === "validator") {
      setPeerCount("50");
      setRatePerPeer("15");
      setRpcQps("0");
      setRpcPayloadKb("4");
      setBurstFactor("1.5");
    } else if (mode === "rpc-dapp") {
      setPeerCount("60");
      setRatePerPeer("15");
      setRpcQps("40");
      setRpcPayloadKb("5");
      setBurstFactor("2.0");
    } else if (mode === "heavy-node") {
      setPeerCount("100");
      setRatePerPeer("25");
      setRpcQps("150");
      setRpcPayloadKb("6");
      setBurstFactor("2.0");
    }
  };

  return (
    <div className="space-y-8">
      {/* Tool Introduction */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="w-6 h-6 text-cyan-400" />
          <span>Bandwidth &amp; Data Transfer Planning Calculator</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Estimate required symmetric internet throughput (Mbps) and monthly data transfer volume (GB / TB) based on peer gossip density and optional public JSON-RPC query loads.
        </p>
      </div>

      {/* Preset Profiles */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 font-mono flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Usage Profiles:
        </span>
        <Button size="sm" variant="ghost" onClick={() => handleApplyPreset("validator")}>
          Private Staking Validator (P2P Only)
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleApplyPreset("rpc-dapp")}>
          Community RPC Endpoint (40 QPS)
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleApplyPreset("heavy-node")}>
          High-Throughput Node (150 QPS)
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-5 p-5 rounded-2xl border border-slate-800 bg-[#070b16]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
            Network Traffic Variables
          </h3>

          {/* Peer Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200">Active Peer Count</label>
              <span className="text-slate-400 font-mono">Unit: Peers (Default: 50)</span>
            </div>
            <input
              type="number"
              min="5"
              max="250"
              value={peerCount}
              onChange={(e) => setPeerCount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.peers && <p className="text-xs text-rose-400">{errors.peers}</p>}
          </div>

          {/* Average Egress per Peer */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200">Average P2P Gossip Rate per Peer (KB/s)</label>
              <span className="text-slate-400 font-mono">Unit: Kilobytes / second</span>
            </div>
            <input
              type="number"
              min="1"
              max="200"
              value={ratePerPeer}
              onChange={(e) => setRatePerPeer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.rate && <p className="text-xs text-rose-400">{errors.rate}</p>}
          </div>

          {/* JSON-RPC QPS */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200">Public JSON-RPC Queries / Second (QPS)</label>
              <span className="text-slate-400 font-mono">0 for private validator</span>
            </div>
            <input
              type="number"
              min="0"
              max="1000"
              value={rpcQps}
              onChange={(e) => setRpcQps(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.qps && <p className="text-xs text-rose-400">{errors.qps}</p>}
          </div>

          {/* Average RPC Response Size */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200">Average RPC Response Payload (KB)</label>
              <span className="text-slate-400 font-mono">Unit: Kilobytes (KB)</span>
            </div>
            <input
              type="number"
              min="0.5"
              max="100"
              step="0.5"
              value={rpcPayloadKb}
              onChange={(e) => setRpcPayloadKb(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.payload && <p className="text-xs text-rose-400">{errors.payload}</p>}
          </div>

          {/* Peak Burst Factor */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-200">Peak Burst Multiplier</label>
              <span className="text-slate-400 font-mono">Recommended: 1.5x</span>
            </div>
            <input
              type="number"
              min="1.0"
              max="3.0"
              step="0.1"
              value={burstFactor}
              onChange={(e) => setBurstFactor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
            {errors.burst && <p className="text-xs text-rose-400">{errors.burst}</p>}
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Bandwidth Profile</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {sustainedMbps.toFixed(1)} <span className="text-lg text-cyan-400">Mbps</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">Sustained Rate</span>
              </div>
            </div>

            {/* Recommended Internet Service Package */}
            <div className="p-4 rounded-xl bg-[#0b101d] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                  Recommended Connection Speed
                </span>
                <Badge variant="cyan" size="sm">
                  With {burstFactor}x Burst Headroom
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {recommendedMbps.toFixed(0)} Mbps (Symmetric)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adequate for normal peer attestation gossip plus peak burst traffic during client updates and fork synchronizations.
              </p>
            </div>

            {/* Monthly Transfer Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Monthly Data Transfer (GB)</span>
                <span className="text-xl font-bold text-white">{monthlyTransferGb.toFixed(0)} GB</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Monthly Data Transfer (TB)</span>
                <span className="text-xl font-bold text-cyan-300">{monthlyTransferTb.toFixed(2)} TB</span>
              </div>
            </div>

            {/* ISP Data Cap Warning */}
            {exceedsTypicalDataCap && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ISP Data Cap Warning</span>
                </div>
                <p className="leading-relaxed">
                  Projected monthly transfer ({monthlyTransferTb.toFixed(2)} TB) exceeds standard consumer ISP data caps (typically 1.2 TB / month). Ensure your home or commercial broadband has an <strong>unmetered / unlimited data package</strong> to avoid punitive overage penalties or throttling.
                </p>
              </div>
            )}
          </div>

          <DisclaimerNotice toolName="Bandwidth Estimator" />
        </div>
      </div>

      {/* Formula & Calculation Logic */}
      <FormulaCard
        formula="Total MB/s = ((Peers × KB/s_peer) / 1024) + ((RPC_QPS × KB_payload) / 1024)
Sustained Mbps = Total MB/s × 8
Monthly Transfer (GB) = (Total MB/s × 3600 × 730) / 1024"
        variables={[
          { name: "Peers", description: "Simultaneous active P2P node connections in consensus mesh", unit: "Peers" },
          { name: "KB/s_peer", description: "Average upstream/downstream gossip rate per peer", unit: "KB/s" },
          { name: "RPC_QPS", description: "JSON-RPC client queries handled per second", unit: "req/sec" },
          { name: "KB_payload", description: "Average response size for dApp method calls (eth_getBlock, etc.)", unit: "KB" },
        ]}
        assumptions={[
          "Calculations assume continuous 24/7/365 connectivity across 730 monthly operating hours.",
          "Peer bandwidth represents bidirectional gossip; actual throughput varies based on consensus slot reorganization frequency.",
        ]}
      />
    </div>
  );
}
