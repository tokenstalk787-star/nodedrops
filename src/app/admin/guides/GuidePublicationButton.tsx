"use client";

import React, { useState, useTransition } from "react";
import { PublicationStatus } from "@prisma/client";
import { toggleGuidePublicationAction } from "@/lib/actions/admin.actions";

interface GuidePublicationButtonProps {
  guideId: string;
  initialStatus: PublicationStatus;
}

export function GuidePublicationButton({ guideId, initialStatus }: GuidePublicationButtonProps) {
  const [status, setStatus] = useState<PublicationStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as PublicationStatus;
    setStatus(nextStatus);
    startTransition(async () => {
      await toggleGuidePublicationAction(guideId, nextStatus);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={handleStatusChange}
        className={`text-xs font-mono rounded-lg px-2 py-1 border transition-colors ${
          status === PublicationStatus.PUBLISHED
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : status === PublicationStatus.DRAFT
            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
            : "bg-slate-800 border-slate-700 text-slate-400"
        } ${isPending ? "opacity-50 cursor-wait" : ""}`}
      >
        <option value={PublicationStatus.PUBLISHED}>PUBLISHED</option>
        <option value={PublicationStatus.DRAFT}>DRAFT</option>
        <option value={PublicationStatus.ARCHIVED}>ARCHIVED</option>
      </select>
      {isPending && <span className="text-[10px] text-cyan-400 font-mono animate-pulse">updating...</span>}
    </div>
  );
}
