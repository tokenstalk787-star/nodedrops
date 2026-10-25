import React from "react";
import { Terminal, ShieldAlert, AlertTriangle } from "lucide-react";
import { CopyCommandButton } from "./CopyCommandButton";
import { cn } from "@/lib/utils";

export interface CommandBlockProps {
  command: string;
  language?: "bash" | "powershell" | "yaml" | "toml" | "json";
  isElevated?: boolean; // Requires sudo / administrator
  isDestructive?: boolean; // Pruning, database wipe, disk format
  explanation?: string;
  className?: string;
}

export function CommandBlock({
  command,
  language = "bash",
  isElevated = false,
  isDestructive = false,
  explanation,
  className,
}: CommandBlockProps) {
  const isPowerShell = language === "powershell";

  return (
    <div className={cn("rounded-xl border border-slate-800 bg-[#07090f] overflow-hidden my-4", className)}>
      {/* Block Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-[#0b101d] text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-mono font-semibold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isPowerShell ? "Windows PowerShell" : "Linux / macOS Shell (Bash)"}</span>
          </span>

          {isElevated && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <ShieldAlert className="w-3 h-3" />
              <span>Elevated Sudo / Admin</span>
            </span>
          )}

          {isDestructive && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-3 h-3" />
              <span>Potentially Destructive</span>
            </span>
          )}
        </div>

        <CopyCommandButton command={command.trim()} />
      </div>

      {/* Command Snippet */}
      <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed selection:bg-cyan-500/30">
        <pre className="m-0 whitespace-pre">
          <code>{command.trim()}</code>
        </pre>
      </div>

      {/* Explanation footnote if provided */}
      {explanation && (
        <div className="px-4 py-2.5 bg-[#090e1a] border-t border-slate-800/60 text-xs text-slate-400 leading-normal">
          <strong className="text-slate-300">Explanation: </strong>
          {explanation}
        </div>
      )}
    </div>
  );
}
