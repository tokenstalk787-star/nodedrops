import React from "react";
import { VerificationStatus as PrismaVerificationStatus } from "@prisma/client";
import { CheckCircle2, FileCheck2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface VerificationStatusProps {
  status: PrismaVerificationStatus;
  size?: "sm" | "md";
  verifiedDate?: string | Date | null;
}

export function VerificationStatusBadge({
  status,
  size = "sm",
  verifiedDate,
}: VerificationStatusProps) {
  const formattedDate = verifiedDate
    ? new Date(verifiedDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  switch (status) {
    case PrismaVerificationStatus.SETUP_TESTED:
      return (
        <Badge variant="success" size={size} withDot>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Setup Tested</span>
            {formattedDate && <span className="opacity-75 font-mono text-[10px]">({formattedDate})</span>}
          </span>
        </Badge>
      );
    case PrismaVerificationStatus.OFFICIAL_DOCS_VERIFIED:
      return (
        <Badge variant="cyan" size={size} withDot>
          <span className="flex items-center gap-1">
            <FileCheck2 className="w-3 h-3 text-cyan-400" />
            <span>Docs Verified</span>
            {formattedDate && <span className="opacity-75 font-mono text-[10px]">({formattedDate})</span>}
          </span>
        </Badge>
      );
    case PrismaVerificationStatus.COMMUNITY_REPORTED:
      return (
        <Badge variant="warning" size={size}>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>Community Reported</span>
          </span>
        </Badge>
      );
    case PrismaVerificationStatus.UNDER_REVIEW:
    default:
      return (
        <Badge variant="neutral" size={size}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Under Review</span>
          </span>
        </Badge>
      );
  }
}
