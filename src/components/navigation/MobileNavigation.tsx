"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { MAIN_NAV_ITEMS, NavItem } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export interface MobileNavigationProps {
  items?: NavItem[];
}

export function MobileNavigation({ items = MAIN_NAV_ITEMS }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu automatically whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-menu"
        aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop & Drawer */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          className="fixed inset-0 top-16 z-50 bg-[#0a0d14]/95 backdrop-blur-xl border-t border-slate-800 flex flex-col justify-between overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <Logo size="sm" asLink={false} />
              <span className="text-xs font-mono text-cyan-400">Navigation</span>
            </div>

            <nav aria-label="Mobile Navigation" className="space-y-2">
              {items.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-xl transition-all border",
                      isActive
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                        : "bg-[#0e1424] border-slate-800/80 text-slate-200 hover:border-slate-700 hover:bg-[#131b2e]"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wider rounded-full",
                              item.badge === "Live"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" aria-hidden="true" />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-6 border-t border-slate-800/80 bg-[#07090f]">
            <Link
              href="/tools"
              className="flex items-center justify-center w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              Open Operator Tools
            </Link>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              NodeDrops.xyz — Research-first node knowledge base
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
