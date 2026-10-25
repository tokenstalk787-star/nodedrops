import React from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NetworkDetail } from "./NetworkOverview";

export interface OfficialSourcesProps {
  network: NetworkDetail;
}

export function OfficialSources({ network }: OfficialSourcesProps) {
  if (network.networkSources.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Upstream Sources</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {network.networkSources.map((ns) => (
            <div
              key={ns.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#07090f] border border-slate-800"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    {ns.source.name}
                  </h4>
                  <Badge variant="cyan" size="sm">
                    {ns.source.sourceType}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {ns.relationship || "Verified upstream documentation"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-emerald-400">
                  Reliability: {ns.source.reliabilityScore}%
                </span>
                <a
                  href={ns.source.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  <span>Visit Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
