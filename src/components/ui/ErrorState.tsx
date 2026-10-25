import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  errorDetails?: string;
  onRetry?: () => void;
  actionText?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this data. Please try again or return to the directory.",
  errorDetails,
  onRetry,
  actionText = "Try Again",
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-[#140f1a] border border-rose-900/40",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
        <AlertCircle className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-rose-200 tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-300 max-w-sm mt-1.5 mb-4 leading-relaxed">
        {message}
      </p>

      {errorDetails && (
        <pre className="text-[11px] font-mono bg-black/40 border border-slate-800 text-slate-400 rounded-lg p-3 max-w-md w-full overflow-x-auto text-left mb-6">
          {errorDetails}
        </pre>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="border-rose-500/40 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/60"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
