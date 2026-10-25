import React from "react";
import { cn } from "@/lib/utils";

export interface GuideStepProps {
  stepNumber: number;
  title: string;
  id?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function GuideStep({
  stepNumber,
  title,
  id,
  description,
  children,
  className,
}: GuideStepProps) {
  const stepId = id || `step-${stepNumber}`;

  return (
    <section id={stepId} className={cn("scroll-mt-24 space-y-4 my-8", className)}>
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold shrink-0 mt-0.5">
          {stepNumber}
        </span>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
            {title}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="pl-0 sm:pl-10 space-y-4">{children}</div>
    </section>
  );
}
