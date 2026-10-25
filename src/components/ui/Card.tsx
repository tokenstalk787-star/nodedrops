import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: "cyan" | "blue" | "violet" | "none";
}

export function Card({
  className,
  hoverable = false,
  glow = "none",
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    none: "",
    cyan: "hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]",
    blue: "hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]",
    violet: "hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]",
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-[#0e1424] border border-slate-800/80 text-slate-100 shadow-sm transition-all duration-200",
        hoverable && "hover:-translate-y-0.5 hover:border-slate-700 cursor-pointer",
        hoverable && glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pb-3 border-b border-slate-800/60", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold text-white tracking-tight leading-snug", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-400 mt-1 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-5 pt-3 border-t border-slate-800/60 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}
