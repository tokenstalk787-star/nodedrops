import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpectedOutputProps {
  output: string;
  title?: string;
  className?: string;
}

export function ExpectedOutput({
  output,
  title = "Expected Terminal Output",
  className,
}: ExpectedOutputProps) {
  return (
    <div className={cn("rounded-xl border border-emerald-500/30 bg-[#061014] overflow-hidden my-4", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-500/20 bg-emerald-500/10 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{title}</span>
        </span>
        <span className="text-[10px] font-mono text-emerald-400/80">Verification Check</span>
      </div>

      <div className="p-4 overflow-x-auto font-mono text-xs text-emerald-200/90 leading-relaxed">
        <pre className="m-0 whitespace-pre">
          <code>{output.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
