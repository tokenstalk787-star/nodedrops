"use client";

import React, { useState, useTransition } from "react";
import { SubmissionStatus } from "@prisma/client";
import { updateSubmissionStatusAction } from "@/lib/actions/admin.actions";

interface SubmissionStatusButtonProps {
  submissionId: string;
  initialStatus: SubmissionStatus;
}

export function SubmissionStatusButton({ submissionId, initialStatus }: SubmissionStatusButtonProps) {
  const [status, setStatus] = useState<SubmissionStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as SubmissionStatus;
    setStatus(nextStatus);
    startTransition(async () => {
      await updateSubmissionStatusAction(submissionId, nextStatus);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={handleStatusChange}
        className={`text-xs font-mono rounded-lg px-2 py-1 border transition-colors ${
          status === SubmissionStatus.RESOLVED
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : status === SubmissionStatus.REVIEWED
            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
            : "bg-amber-500/10 border-amber-500/30 text-amber-300"
        } ${isPending ? "opacity-50 cursor-wait" : ""}`}
      >
        <option value={SubmissionStatus.PENDING}>PENDING</option>
        <option value={SubmissionStatus.REVIEWED}>REVIEWED</option>
        <option value={SubmissionStatus.RESOLVED}>RESOLVED</option>
      </select>
    </div>
  );
}
