"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Play, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPreset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  command: string;
  output: string[];
}

const PRESETS: CommandPreset[] = [
  {
    id: "arbitrum",
    name: "Arbitrum One",
    symbol: "ARB",
    type: "Nitro Full Node",
    command: `docker run --rm -d --name nitro-node \\
  -v /data/arbitrum:/home/user/.arbitrum \\
  -p 8547:8547 -p 8548:8548 \\
  offchainlabs/nitro-node:v3.2.1-d81324d \\
  --l1.url="https://eth.llamarpc.com" \\
  --http.addr=0.0.0.0 --http.api=net,web3,eth`,
    output: [
      "[INFO] Nitro sequencer feed connected: wss://one.arbitrum.io/feed",
      "[INFO] Catching up block batches from L1 inbox...",
      "[SYNC] Ingested 14,290 rollup blocks (lag: 0.12s)",
      "[RPC]  JSON-RPC HTTP server active on 0.0.0.0:8547",
    ],
  },
  {
    id: "ethereum",
    name: "Ethereum Holesky",
    symbol: "ETH",
    type: "Geth Execution Node",
    command: `geth --holesky \\
  --datadir /data/holesky \\
  --http --http.api eth,net,web3,engine \\
  --authrpc.addr localhost --authrpc.port 8551 \\
  --authrpc.jwtsecret /data/jwt.hex`,
    output: [
      "[INFO] Allocated 4096MB cache memory to state database",
      "[P2P]  Discovered 48 consensus peers on Holesky testnet",
      "[SYNC] Imported new chain segment: block #2,810,490",
      "[AUTH] Engine API listening for Lighthouse/Prysm consensus",
    ],
  },
  {
    id: "base",
    name: "Base Mainnet",
    symbol: "BASE",
    type: "OP-Geth RPC Node",
    command: `docker run -d --name op-geth-base \\
  -v /data/base:/data \\
  -p 8545:8545 \\
  us-docker.pkg.dev/oplabs-tools-data/images/op-geth:v1.101315.3 \\
  --datadir=/data --rollup.sequencerhttp=https://mainnet-sequencer.base.org`,
    output: [
      "[INFO] OP Stack rollup driver initialized",
      "[P2P]  P2P node ID: 16Uiu2HAmP8sK... active",
      "[SYNC] State trie synced up to block #21,894,000",
      "[HTTP] Base RPC serving read requests (0 errors)",
    ],
  },
];

export function HeroInteractiveTerminal() {
  const [activePreset, setActivePreset] = useState<CommandPreset>(PRESETS[0]);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activePreset.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2500);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none rounded-2xl border border-cyan-500/30 bg-[#070b16]/90 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.15)] overflow-hidden transition-all hover:border-cyan-400/50 group">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f1d] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 ml-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>nodedrops-terminal ~ {activePreset.name.toLowerCase()}</span>
          </span>
        </div>

        {/* Quick Chain Selector */}
        <div className="flex items-center gap-1 bg-[#060a14] p-0.5 rounded-lg border border-slate-800">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePreset(p)}
              aria-label={`Switch terminal preset to ${p.name} (${p.symbol})`}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all",
                activePreset.id === p.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {p.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-5 font-mono text-xs space-y-4">
        {/* Preset Info Tag */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-semibold">
              {activePreset.name}
            </span>
            <span className="text-slate-400">{activePreset.type}</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Empirically Verified</span>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative group/code bg-[#04060c] p-3.5 rounded-xl border border-slate-800/90 text-slate-200 overflow-x-auto">
          <div className="flex items-start justify-between gap-2">
            <pre className="text-xs leading-relaxed text-cyan-200/90">
              <code>{activePreset.command}</code>
            </pre>

            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-all focus:outline-none"
              title="Copy snippet"
              aria-label="Copy snippet"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Live Simulated Output Feed */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider text-slate-500">
            <span>Telemetry Simulation Feed</span>
            <button
              type="button"
              onClick={handleSimulate}
              disabled={isRunning}
              aria-label="Simulate node telemetry ping"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
            >
              <Play className={cn("w-3 h-3", isRunning && "animate-spin")} />
              <span>{isRunning ? "Simulating..." : "Test Ping"}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#040711] border border-slate-800/60 space-y-1 text-[11px] leading-relaxed">
            {activePreset.output.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2",
                  line.includes("[SYNC]")
                    ? "text-cyan-300"
                    : line.includes("[P2P]") || line.includes("[RPC]")
                    ? "text-emerald-300"
                    : "text-slate-400"
                )}
              >
                <span className="text-slate-600 select-none">&gt;</span>
                <span className="truncate">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal Bottom Controls */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero proprietary binaries • Open upstream sources</span>
          </span>
          <span className="text-cyan-400 font-semibold font-mono">100% Deterministic</span>
        </div>
      </div>
    </div>
  );
}
