import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DisclaimerNoticeProps {
  toolName?: string;
  className?: string;
}

export function DisclaimerNotice({
  toolName = "Estimator",
  className,
}: DisclaimerNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/90 leading-relaxed",
        className
      )}
    >
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <strong className="text-amber-300 font-semibold">Important Capacity Planning Notice: </strong>
        Calculations produced by this {toolName} are projections intended solely for hardware sizing, capacity planning, and budgeting. Actual resource utilization varies depending on network throughput, peer count, blockchain state expansion, client implementation optimizations, and hosting provider policies. Calculations are not guarantees of actual performance.
      </div>
    </div>
  );
}
