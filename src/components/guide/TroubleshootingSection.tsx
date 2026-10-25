import React from "react";
import { Wrench, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export interface TroubleshootingItem {
  problem: string;
  symptom?: string;
  solution: string;
}

export interface TroubleshootingSectionProps {
  items: TroubleshootingItem[];
}

export function TroubleshootingSection({ items }: TroubleshootingSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <Card className="my-8 border-slate-800">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-base flex items-center gap-2 text-white">
          <Wrench className="w-4 h-4 text-cyan-400" />
          <span>Troubleshooting &amp; Common Failure Modes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#07090f] border border-slate-800/80 space-y-2"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <h4 className="text-sm font-semibold text-white">{item.problem}</h4>
            </div>

            {item.symptom && (
              <p className="text-xs text-slate-400 font-mono pl-6">
                Symptom: {item.symptom}
              </p>
            )}

            <div className="text-xs text-slate-300 pl-6 leading-relaxed bg-[#0a0f1d] p-3 rounded-lg border border-slate-800/60 mt-1">
              <strong className="text-cyan-400 font-medium">Remedy: </strong>
              {item.solution}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
