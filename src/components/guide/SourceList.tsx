import React from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Prisma } from "@prisma/client";

export type GuideSourceWithDetail = Prisma.GuideSourceGetPayload<{
  include: { source: true };
}>;

export interface SourceListProps {
  sources: GuideSourceWithDetail[];
}

export function SourceList({ sources }: SourceListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <Card className="my-8">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official References &amp; Upstream Sources ({sources.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {sources.map((gs) => (
          <div
            key={gs.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#07090f] border border-slate-800"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {gs.source.name}
                </span>
                <Badge variant="cyan" size="sm">
                  {gs.source.sourceType}
                </Badge>
              </div>
              {gs.notes && <p className="text-xs text-slate-400">{gs.notes}</p>}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-emerald-400">
                Reliability: {gs.source.reliabilityScore}%
              </span>
              <a
                href={gs.source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                <span>Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
