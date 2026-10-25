import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export interface PrerequisitesPanelProps {
  items: string[];
}

export function PrerequisitesPanel({ items }: PrerequisitesPanelProps) {
  if (!items || items.length === 0) return null;

  return (
    <Card className="my-6 border-cyan-500/20 bg-[#090f1e]/80">
      <CardHeader className="pb-3 border-b border-cyan-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Deployment Prerequisites</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
