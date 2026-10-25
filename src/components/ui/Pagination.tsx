import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const generatePagination = () => {
    const totalNumbers = siblingCount + 5;

    if (totalNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "DOTS_RIGHT", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "DOTS_LEFT", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "DOTS_LEFT", ...middleRange, "DOTS_RIGHT", lastPageIndex];
    }

    return range(1, totalPages);
  };

  const pages = generatePagination();

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn("flex items-center justify-center space-x-1 select-none", className)}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Go to previous page"
        className={cn(
          "inline-flex items-center justify-center h-9 px-3 rounded-lg text-xs font-medium border border-slate-700/80 bg-[#0e1424] text-slate-300 transition-colors",
          "hover:bg-[#151f38] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0e1424]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        )}
      >
        <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
        <span>Prev</span>
      </button>

      <div className="flex items-center space-x-1">
        {pages.map((page, index) => {
          if (typeof page === "string") {
            return (
              <span
                key={`dots-${index}`}
                className="inline-flex items-center justify-center w-9 h-9 text-slate-500"
                aria-hidden="true"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-medium border transition-colors",
                isCurrent
                  ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "bg-[#0e1424] border-slate-700/80 text-slate-300 hover:bg-[#151f38] hover:text-white",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Go to next page"
        className={cn(
          "inline-flex items-center justify-center h-9 px-3 rounded-lg text-xs font-medium border border-slate-700/80 bg-[#0e1424] text-slate-300 transition-colors",
          "hover:bg-[#151f38] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0e1424]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        )}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
      </button>
    </nav>
  );
}
