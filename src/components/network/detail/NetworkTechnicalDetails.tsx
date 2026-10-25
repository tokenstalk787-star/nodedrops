import React from "react";
import { Cpu, HardDrive, Activity, Server, Terminal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NetworkDetail } from "./NetworkOverview";

export interface NetworkTechnicalDetailsProps {
  network: NetworkDetail;
}

export function NetworkTechnicalDetails({ network }: NetworkTechnicalDetailsProps) {
  const isEvm = Boolean(network.chainId && network.chainId !== "");

  return (
    <div className="space-y-8">
      {/* 1. Network & Chain Architecture Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Chain & Consensus Architecture</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
              <span className="text-slate-500 font-sans">Consensus Mechanism</span>
              <p className="text-white font-semibold">{network.consensus}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
              <span className="text-slate-500 font-sans">Layer Classification</span>
              <p className="text-white font-semibold">{network.layer}</p>
            </div>

            {/* Display Chain ID only when present (Support non-EVM networks like Solana gracefully) */}
            {isEvm && (
              <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
                <span className="text-slate-500 font-sans">EVM Chain ID</span>
                <p className="text-cyan-400 font-bold">{network.chainId}</p>
              </div>
            )}

            <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
              <span className="text-slate-500 font-sans">Network Status</span>
              <p className="text-emerald-400 font-bold">{network.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Client Software Distributions */}
      {network.clients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Supported Client Software</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {network.clients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 rounded-xl bg-[#07090f] border border-slate-800/80 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="cyan" size="sm">
                        {client.clientType}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">{client.language}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1">{client.name}</h4>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400 font-mono flex items-center justify-between">
                    <span>Target: {client.recommendedVersion || "Latest Stable"}</span>
                    {client.repoUrl && (
                      <a
                        href={client.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        Repo →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Hardware Requirements by Node Role */}
      {network.hardwareRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" />
              <span>Empirical Hardware Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {network.hardwareRequirements.map((hw) => (
                <div
                  key={hw.id}
                  className="p-4 rounded-xl bg-[#07090f] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <span>{hw.nodeType}</span>
                    </h4>
                    <span className="text-xs font-mono text-cyan-300">
                      Bandwidth: {hw.bandwidthMbps} Mbps
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-sans flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-slate-400" /> CPU Baseline:
                      </span>
                      <p className="text-slate-200">{hw.minCpu}</p>
                      <p className="text-[11px] text-slate-500">Rec: {hw.recCpu}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 font-sans flex items-center gap-1">
                        <Activity className="w-3 h-3 text-slate-400" /> Memory:
                      </span>
                      <p className="text-slate-200">{hw.minRamGb} GB RAM</p>
                      <p className="text-[11px] text-slate-500">Rec: {hw.recRamGb} GB</p>
                    </div>

                    <div className="col-span-2 space-y-1 pt-1 border-t border-slate-800/60">
                      <span className="text-slate-500 font-sans flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-slate-400" /> Storage ({hw.storageType}):
                      </span>
                      <p className="text-slate-200">
                        {hw.minStorageGb} GB minimum baseline (Recommended: {hw.recStorageGb} GB)
                      </p>
                    </div>
                  </div>

                  {hw.notes && (
                    <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 italic">
                      Note: {hw.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
