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
    sm: "text-base gap-2",
    md: "text-lg gap-2.5",
    lg: "text-2xl gap-3",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const content = (
    <div className={cn("inline-flex items-center font-bold tracking-tight text-white select-none group", sizeClasses[size], className)}>
      {/* NodeDrops Emblem Mark */}
      <span className={cn("relative flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-105", iconSizes[size])}>
        <svg
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="nd-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            <linearGradient id="nd-drop-fill" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.04" />
            </linearGradient>

            <radialGradient id="nd-glow" cx="50%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Glow Aura */}
          <circle cx="64" cy="68" r="48" fill="url(#nd-glow)" />

          {/* Crystalline Droplet Outer Shell */}
          <path
            d="M 64,15 C 66,17 87,46 97,69 C 105,87 97,105 81,112 C 71,116 57,116 47,112 C 31,105 23,87 31,69 C 41,46 62,17 64,15 Z"
            fill="url(#nd-drop-fill)"
            stroke="url(#nd-logo-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle Crystalline Facet */}
          <path
            d="M 64,18 L 64,66 L 33,69 C 43,46 62,17 64,18 Z"
            fill="#ffffff"
            fillOpacity="0.06"
          />

          {/* Interconnected Blockchain Node Grid */}
          {/* Apex -> Core */}
          <line x1="64" y1="34" x2="64" y2="66" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" opacity="0.95" />
          {/* Core -> Left */}
          <line x1="64" y1="66" x2="44" y2="88" stroke="#60a5fa" strokeWidth="2.8" strokeLinecap="round" opacity="0.9" />
          {/* Core -> Right */}
          <line x1="64" y1="66" x2="84" y2="88" stroke="#a78bfa" strokeWidth="2.8" strokeLinecap="round" opacity="0.9" />
          {/* Left -> Right (Consensus Ledger) */}
          <line x1="44" y1="88" x2="84" y2="88" stroke="#818cf8" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="3 3" opacity="0.8" />
          {/* Outer Isometric Facet Lines */}
          <line x1="64" y1="34" x2="44" y2="88" stroke="#38bdf8" strokeWidth="1.6" strokeOpacity="0.35" />
          <line x1="64" y1="34" x2="84" y2="88" stroke="#c084fc" strokeWidth="1.6" strokeOpacity="0.35" />

          {/* Nodes (Vertices) */}
          {/* Left Node */}
          <circle cx="44" cy="88" r="6.5" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="44" cy="88" r="2.8" fill="#ffffff" />

          {/* Right Node */}
          <circle cx="84" cy="88" r="6.5" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
          <circle cx="84" cy="88" r="2.8" fill="#ffffff" />

          {/* Apex Beacon Node */}
          <circle cx="64" cy="34" r="7" fill="#0e7490" stroke="#00f2fe" strokeWidth="2.4" />
          <circle cx="64" cy="34" r="3.2" fill="#ffffff" />

          {/* Center Nexus Core Node */}
          <circle cx="64" cy="66" r="9.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.8" />
          <circle cx="64" cy="66" r="5" fill="url(#nd-logo-grad)" />
          <circle cx="64" cy="66" r="2.2" fill="#ffffff" />
        </svg>
      </span>

      {/* Brand Wordmark */}
      <span className="flex items-baseline tracking-tight">
        <span className="text-white font-extrabold group-hover:text-slate-100 transition-colors">Node</span>
        <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent font-extrabold ml-0.5">
          Drops
        </span>
        <span className="text-[0.65em] uppercase font-mono font-semibold tracking-wider text-cyan-400/90 ml-1.5 px-1 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/25">
          xyz
        </span>
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className="inline-flex rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d14]"
        aria-label="NodeDrops Homepage"
      >
        {content}
      </Link>
    );
  }

  return content;
}
