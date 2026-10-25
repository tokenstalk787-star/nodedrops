import React from "react";
import { Cpu, Activity, HardDrive, Network as NetworkIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export interface HardwareSpecs {
  minCpu: string;
  recCpu?: string;
  minRamGb: number;
  recRamGb?: number;
  minStorageGb: number;
  recStorageGb?: number;
  storageType?: string;
  bandwidthMbps?: number;
  notes?: string | null;
}

export interface HardwareRequirementsProps {
  hardware: HardwareSpecs;
  nodeType?: string;
}

export function HardwareRequirements({ hardware, nodeType = "Node" }: HardwareRequirementsProps) {
  return (
    <Card className="my-6">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>Empirical Hardware Baselines ({nodeType})</span>
          </span>
          <span className="text-xs font-mono text-cyan-400 font-normal">
            Tested &amp; Documented
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
            <span className="text-slate-500 font-sans flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" /> Processor (CPU)
            </span>
            <p className="text-slate-200 font-semibold">{hardware.minCpu}</p>
            {hardware.recCpu && <p className="text-[11px] text-slate-500">Rec: {hardware.recCpu}</p>}
          </div>

          <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
            <span className="text-slate-500 font-sans flex items-center gap-1">
              <Activity className="w-3 h-3 text-blue-400" /> Memory (RAM)
            </span>
            <p className="text-slate-200 font-semibold">{hardware.minRamGb} GB</p>
            {hardware.recRamGb && <p className="text-[11px] text-slate-500">Rec: {hardware.recRamGb} GB</p>}
          </div>

          <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
            <span className="text-slate-500 font-sans flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-violet-400" /> Storage
            </span>
            <p className="text-slate-200 font-semibold">
              {hardware.minStorageGb} GB ({hardware.storageType || "NVMe SSD"})
            </p>
            {hardware.recStorageGb && (
              <p className="text-[11px] text-slate-500">Rec: {hardware.recStorageGb} GB</p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
            <span className="text-slate-500 font-sans flex items-center gap-1">
              <NetworkIcon className="w-3 h-3 text-emerald-400" /> Network
            </span>
            <p className="text-slate-200 font-semibold">
              {hardware.bandwidthMbps || 100} Mbps+
            </p>
            <p className="text-[11px] text-slate-500">Unmetered recommended</p>
          </div>
        </div>

        {hardware.notes && (
          <p className="text-[11px] text-slate-400 mt-3 italic leading-relaxed">
            Note: {hardware.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
