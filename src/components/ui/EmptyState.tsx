import React from "react";
import Link from "next/link";
import { FolderSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-[#0b101d] border border-dashed border-slate-800",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        {icon || <FolderSearch className="w-7 h-7" aria-hidden="true" />}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="secondary" size="sm">
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
