import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "purple" | "cyan";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  withDot?: boolean;
  withPing?: boolean;
  children: React.ReactNode;
}

export function Badge({
  variant = "neutral",
  size = "md",
  withDot = false,
  withPing = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    success: {
      container: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      dot: "bg-emerald-400",
    },
    warning: {
      container: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      dot: "bg-amber-400",
    },
    error: {
      container: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      dot: "bg-rose-400",
    },
    info: {
      container: "bg-sky-500/10 text-sky-300 border-sky-500/30",
      dot: "bg-sky-400",
    },
    neutral: {
      container: "bg-slate-800/60 text-slate-300 border-slate-700/60",
      dot: "bg-slate-400",
    },
    purple: {
      container: "bg-violet-500/10 text-violet-300 border-violet-500/30",
      dot: "bg-violet-400",
    },
    cyan: {
      container: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      dot: "bg-cyan-400",
    },
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border tracking-wide select-none",
        variantStyles[variant].container,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {withDot && (
        <span className="relative flex h-2 w-2 items-center justify-center">
          {withPing && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                variantStyles[variant].dot
              )}
            />
          )}
          <span
            className={cn("relative inline-flex rounded-full h-1.5 w-1.5", variantStyles[variant].dot)}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
