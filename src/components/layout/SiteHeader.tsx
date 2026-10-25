"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0a0d14]/80 backdrop-blur-md transition-all",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Logo size="md" />
          {/* Desktop Navigation */}
          <DesktopNavigation />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/guides"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0e1424] hover:bg-[#141d33] border border-slate-700/60 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>Verified Guides</span>
          </Link>

          <Link href="/tools">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Terminal className="w-3.5 h-3.5" />}
              className="hidden sm:inline-flex"
            >
              Deploy Node
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
