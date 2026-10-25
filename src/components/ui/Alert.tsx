"use client";

import React, { useState } from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  children: React.ReactNode;
}

export function Alert({
  variant = "info",
  title,
  dismissible = false,
  onDismiss,
  className,
  children,
  ...props
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  const variantConfig = {
    info: {
      container: "bg-sky-500/10 border-sky-500/30 text-sky-200",
      title: "text-sky-300",
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />,
    },
    success: {
      container: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
      title: "text-emerald-300",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />,
    },
    warning: {
      container: "bg-amber-500/10 border-amber-500/30 text-amber-200",
      title: "text-amber-300",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />,
    },
    error: {
      container: "bg-rose-500/10 border-rose-500/30 text-rose-200",
      title: "text-rose-300",
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />,
    },
  };

  const current = variantConfig[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-lg border p-4 text-sm transition-all",
        current.container,
        className
      )}
      {...props}
    >
      {current.icon}
      <div className="flex-1 space-y-1 pr-6">
        {title && <h4 className={cn("font-semibold text-sm", current.title)}>{title}</h4>}
        <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
