import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

export function Logo({ className, size = "md", asLink = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-base gap-1.5",
    md: "text-lg gap-2",
    lg: "text-2xl gap-2.5",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const content = (
    <div className={cn("inline-flex items-center font-bold tracking-tight text-white select-none group", sizeClasses[size], className)}>
      <span className={cn("relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-violet-500/20 border border-cyan-500/30 p-1 group-hover:border-cyan-400 transition-colors shadow-[0_0_12px_rgba(6,182,212,0.15)]", iconSizes[size])}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-cyan-400"
          aria-hidden="true"
        >
          {/* Node interconnected constellation shape */}
          <circle cx="12" cy="5" r="2" fill="currentColor" />
          <circle cx="5" cy="18" r="2" fill="currentColor" />
          <circle cx="19" cy="18" r="2" fill="currentColor" />
          <circle cx="12" cy="13" r="2" />
          <path d="M12 7v4" />
          <path d="M10.5 14.5L6.5 17" />
          <path d="M13.5 14.5L17.5 17" />
        </svg>
      </span>
      <span className="flex items-baseline">
        <span className="text-white">Node</span>
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Drops</span>
        <span className="text-xs text-cyan-400 font-mono font-normal ml-0.5 opacity-80">.xyz</span>
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d14]" aria-label="NodeDrops Homepage">
        {content}
      </Link>
    );
  }

  return content;
}
