import React from "react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Cpu, Activity, HardDrive, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NetworkTypeBadge } from "./NetworkTypeBadge";
import { EcosystemBadge } from "./EcosystemBadge";

export type NetworkWithRelations = Prisma.NetworkGetPayload<{
  include: {
    clients: true;
    hardwareRequirements: true;
    _count: { select: { networkGuides: true } };
  };
}>;

export interface NetworkCardProps {
  network: NetworkWithRelations;
}

export function NetworkCard({ network }: NetworkCardProps) {
  // Use first hardware requirement as default summary if available
  const primaryHardware = network.hardwareRequirements[0];

  return (
    <Card hoverable glow="cyan" className="flex flex-col justify-between h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <NetworkTypeBadge type={network.networkType} size="sm" />
            <EcosystemBadge category={network.category} size="sm" />
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">{network.symbol}</span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          {network.logoUrl ? (
            <div className="w-10 h-10 rounded-xl bg-[#070b16] border border-cyan-500/30 p-1.5 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:border-cyan-400/60 group-hover:shadow-[0_0_16px_rgba(6,182,212,0.25)] transition-all">
              <img
                src={network.logoUrl}
                alt={`${network.name} official logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
              {network.symbol.slice(0, 2)}
            </div>
          )}

          <div className="min-w-0">
            <CardTitle className="text-lg group-hover:text-cyan-300 transition-colors leading-snug truncate">
              <Link href={`/networks/${network.slug}`} className="hover:underline">
                {network.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-xs">
              {network.consensus} • {network.layer}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {/* Hardware specifications snippet (only if documented) */}
        {primaryHardware ? (
          <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800/80 text-xs font-mono space-y-1">
            <div className="text-[11px] text-slate-500 font-sans font-semibold mb-1">
              Minimum Baseline ({primaryHardware.nodeType}):
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" /> CPU:
              </span>
              <span>{primaryHardware.minCpu}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500 flex items-center gap-1">
                <Activity className="w-3 h-3 text-blue-400" /> RAM:
              </span>
              <span>{primaryHardware.minRamGb} GB</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-violet-400" /> Disk:
              </span>
              <span>{primaryHardware.minStorageGb} GB ({primaryHardware.storageType})</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-[#07090f]/50 border border-slate-800/40 text-xs text-slate-500 italic">
            Hardware requirements under empirical review.
          </div>
        )}

        {/* Client packages */}
        {network.clients.length > 0 && (
          <div className="text-xs text-slate-400 line-clamp-1">
            <span className="font-semibold text-slate-300">Clients: </span>
            {network.clients.map((c) => c.name).join(", ")}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <span className="text-xs text-slate-400 font-medium">
          {network._count.networkGuides} {network._count.networkGuides === 1 ? "runbook" : "runbooks"}
        </span>
        <Link href={`/networks/${network.slug}`}>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Inspect Node
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
