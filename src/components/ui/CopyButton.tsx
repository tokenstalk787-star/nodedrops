"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  label?: string;
  copiedLabel?: string;
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied!",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : `${label}: ${value}`}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors",
        "bg-[#131b2e] hover:bg-[#1a253e] border border-slate-700/70 text-slate-300 hover:text-white",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0d14]",
        copied && "border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15",
        className
      )}
      {...props}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
          <span className="font-sans font-medium text-emerald-300">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 shrink-0" aria-hidden="true" />
          <span className="font-sans text-slate-300">{label}</span>
        </>
      )}
    </button>
  );
}
