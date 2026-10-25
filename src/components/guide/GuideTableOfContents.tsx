"use client";

import React, { useState } from "react";
import { List, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface GuideTableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export function GuideTableOfContents({ items, className }: GuideTableOfContentsProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <aside className={cn("w-full lg:w-64 shrink-0", className)}>
      <div className="sticky top-20 rounded-xl bg-[#0b101d] border border-slate-800 p-4 space-y-3">
        {/* Header */}
        <div
          className="flex items-center justify-between cursor-pointer lg:cursor-default"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
            <List className="w-3.5 h-3.5 text-cyan-400" />
            <span>Table of Contents</span>
          </div>
          <button
            type="button"
            className="lg:hidden text-slate-400 p-1"
            aria-label="Toggle Table of Contents"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpenMobile && "rotate-180")} />
          </button>
        </div>

        {/* Links list */}
        <nav
          aria-label="Table of contents"
          className={cn(
            "space-y-1 text-xs text-slate-400 transition-all",
            !isOpenMobile && "hidden lg:block"
          )}
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setIsOpenMobile(false)}
              className={cn(
                "block py-1.5 px-2 rounded-lg hover:text-cyan-300 hover:bg-slate-800/40 transition-colors truncate",
                item.level === 3 && "pl-4 text-[11px] text-slate-500",
                item.level === 2 && "font-medium text-slate-300"
              )}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
