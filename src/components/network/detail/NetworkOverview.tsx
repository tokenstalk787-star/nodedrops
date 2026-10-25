import React from "react";
import { Prisma, NetworkType } from "@prisma/client";
import { Globe, BookOpen, ExternalLink, ShieldAlert, Code2 } from "lucide-react";
import { NetworkTypeBadge } from "../NetworkTypeBadge";
import { EcosystemBadge } from "../EcosystemBadge";
import { Alert } from "@/components/ui/Alert";

export type NetworkDetail = Prisma.NetworkGetPayload<{
  include: {
    clients: true;
    hardwareRequirements: true;
    networkGuides: {
      include: {
        guide: {
          include: {
            category: true;
          };
        };
      };
    };
    networkSources: {
      include: {
        source: true;
      };
    };
  };
}>;

export interface NetworkOverviewProps {
  network: NetworkDetail;
}

export function NetworkOverview({ network }: NetworkOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <NetworkTypeBadge type={network.networkType} size="md" />
            <EcosystemBadge category={network.category} size="md" />
            <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              {network.symbol}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {network.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {network.consensus} architecture running on {network.layer}.
          </p>
        </div>

        {/* Official Quick Links */}
        <div className="flex flex-wrap items-center gap-2">
          {network.websiteUrl && (
            <a
              href={network.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0e1424] hover:bg-[#141d33] border border-slate-700/80 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Site</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {network.docsUrl && (
            <a
              href={network.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0e1424] hover:bg-[#141d33] border border-slate-700/80 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Developer Docs</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {network.githubUrl && (
            <a
              href={network.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0e1424] hover:bg-[#141d33] border border-slate-700/80 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-violet-400" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}
        </div>
      </div>

      {/* Mainnet Risk Notice */}
      {network.networkType === NetworkType.MAINNET && (
        <Alert variant="warning" title="Production Mainnet Risk Disclosure">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Operating a mainnet validator or RPC endpoint involves real economic risk (e.g., slashing, downtime penalties, or server exploitation). Never store unencrypted private keys or pass validator seed phrases to non-verified scripts.
            </p>
          </div>
        </Alert>
      )}
    </div>
  );
}
