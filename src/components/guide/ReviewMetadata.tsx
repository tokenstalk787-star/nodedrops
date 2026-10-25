import React from "react";
import { VerificationStatus as PrismaVerificationStatus, Difficulty } from "@prisma/client";
import { Clock, Calendar, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VerificationStatusBadge } from "../network/VerificationStatus";

export interface ReviewMetadataProps {
  difficulty: Difficulty;
  estimatedMinutes: number;
  verificationStatus: PrismaVerificationStatus;
  verifiedAt?: Date | string | null;
  authorName?: string | null;
  updatedAt: Date | string;
}

export function ReviewMetadata({
  difficulty,
  estimatedMinutes,
  verificationStatus,
  verifiedAt,
  authorName,
  updatedAt,
}: ReviewMetadataProps) {
  const formattedReviewDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const formattedUpdateDate = new Date(updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono py-4 border-y border-slate-800/80">
      <div className="flex items-center gap-2">
        <span className="text-slate-500 font-sans">Difficulty:</span>
        <Badge
          variant={
            difficulty === "BEGINNER"
              ? "success"
              : difficulty === "INTERMEDIATE"
              ? "info"
              : "purple"
          }
          size="sm"
        >
          {difficulty}
        </Badge>
      </div>

      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span>{estimatedMinutes} mins est.</span>
      </div>

      <div className="flex items-center gap-1.5">
        <VerificationStatusBadge
          status={verificationStatus}
          verifiedDate={verifiedAt}
          size="sm"
        />
      </div>

      {formattedReviewDate && (
        <div className="flex items-center gap-1.5 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Reviewed: {formattedReviewDate}</span>
        </div>
      )}

      {authorName && (
        <div className="flex items-center gap-1.5">
          <UserIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>By {authorName}</span>
        </div>
      )}

      <div className="text-slate-500 ml-auto hidden sm:block">
        Updated: {formattedUpdateDate}
      </div>
    </div>
  );
}
