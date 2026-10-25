"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS, NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface DesktopNavigationProps {
  className?: string;
  items?: NavItem[];
}

export function DesktopNavigation({
  className,
  items = MAIN_NAV_ITEMS,
}: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className={cn("hidden md:flex items-center space-x-1", className)}
    >
      {items.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all select-none flex items-center gap-1.5",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0d14]",
              isActive
                ? "text-cyan-400 bg-cyan-500/10 font-semibold"
                : "text-slate-300 hover:text-white hover:bg-slate-800/40"
            )}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full",
                  item.badge === "Live"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                )}
              >
                {item.badge}
              </span>
            )}
            {isActive && (
              <span
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
