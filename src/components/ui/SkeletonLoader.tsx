import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "h-4 w-full rounded",
    circular: "rounded-full aspect-square",
    rectangular: "rounded-lg",
    card: "h-36 w-full rounded-xl",
  };

  const inlineStyles: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={cn(
        "bg-slate-800/60 animate-pulse motion-reduce:animate-none",
        variantStyles[variant],
        className
      )}
      style={inlineStyles}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-[#0e1424] border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="rectangular" width={64} height={20} />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" height={18} />
        <Skeleton variant="text" width="90%" height={14} />
      </div>
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <Skeleton variant="text" width="30%" height={12} />
        <Skeleton variant="rectangular" width={48} height={24} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-slate-800/80">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className="flex-1"
          height={14}
        />
      ))}
    </div>
  );
}
