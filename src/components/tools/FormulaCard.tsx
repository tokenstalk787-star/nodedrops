import React from "react";
import { Calculator, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormulaCardProps {
  formula: string;
  variables: { name: string; description: string; unit?: string }[];
  assumptions?: string[];
  className?: string;
}

export function FormulaCard({
  formula,
  variables,
  assumptions,
  className,
}: FormulaCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-[#070b16] p-4 sm:p-5 space-y-4 text-xs sm:text-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 text-cyan-400 font-mono font-semibold">
        <Calculator className="w-4 h-4" />
        <span>Mathematical Formula &amp; Computation Logic</span>
      </div>

      {/* Formula Box */}
      <div className="p-3 sm:p-4 rounded-lg bg-[#0b101d] border border-cyan-500/20 font-mono text-cyan-300 overflow-x-auto text-xs sm:text-sm leading-relaxed">
        <code>{formula}</code>
      </div>

      {/* Variables List */}
      {variables && variables.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400">
            Variable Definitions:
          </span>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {variables.map((v, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                <span className="font-mono text-cyan-400 font-semibold shrink-0">
                  {v.name}:
                </span>
                <span>
                  {v.description}
                  {v.unit && <span className="text-slate-500 font-mono"> ({v.unit})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assumptions */}
      {assumptions && assumptions.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Underlying Assumptions:</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-slate-400">
            {assumptions.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
