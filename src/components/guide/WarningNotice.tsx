import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

export interface WarningNoticeProps {
  title?: string;
  children: React.ReactNode;
}

export function WarningNotice({
  title = "Security & Operational Notice",
  children,
}: WarningNoticeProps) {
  return (
    <Alert variant="warning" title={title} className="my-6">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">{children}</div>
      </div>
    </Alert>
  );
}
