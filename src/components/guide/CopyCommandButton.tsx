"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyCommandButtonProps {
  command: string;
  className?: string;
}

export function CopyCommandButton({ command, className }: CopyCommandButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = command;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Command copied" : "Copy command to clipboard"}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-all",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 select-none",
        copied
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
          : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
