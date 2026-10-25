import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumbs({
  items,
  showHome = true,
  className,
  ...props
}: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: "Home", href: "/" }, ...items]
    : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-slate-400 font-medium", className)}
      {...props}
    >
      <ol className="flex items-center space-x-1.5 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 mx-1 text-slate-600 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-xs",
                    index === 0 && showHome && "inline-flex items-center gap-1"
                  )}
                >
                  {index === 0 && showHome && <Home className="w-3.5 h-3.5" aria-hidden="true" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-cyan-400 transition-colors rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400",
                    index === 0 && showHome && "inline-flex items-center gap-1"
                  )}
                >
                  {index === 0 && showHome && <Home className="w-3.5 h-3.5" aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
