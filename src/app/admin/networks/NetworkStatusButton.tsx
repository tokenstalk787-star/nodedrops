"use client";

import React, { useState, useTransition } from "react";
import { NetworkStatus } from "@prisma/client";
import { updateNetworkStatusAction } from "@/lib/actions/admin.actions";

interface NetworkStatusButtonProps {
  networkId: string;
  initialStatus: NetworkStatus;
}

export function NetworkStatusButton({ networkId, initialStatus }: NetworkStatusButtonProps) {
  const [status, setStatus] = useState<NetworkStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as NetworkStatus;
    setStatus(nextStatus);
    startTransition(async () => {
      await updateNetworkStatusAction(networkId, nextStatus);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={handleStatusChange}
        className={`text-xs font-mono rounded-lg px-2 py-1 border transition-colors ${
          status === NetworkStatus.ACTIVE
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : status === NetworkStatus.DEPRECATED
            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
            : "bg-slate-800 border-slate-700 text-slate-300"
        } ${isPending ? "opacity-50 cursor-wait" : ""}`}
      >
        <option value={NetworkStatus.ACTIVE}>ACTIVE</option>
        <option value={NetworkStatus.MAINTENANCE}>MAINTENANCE</option>
        <option value={NetworkStatus.DEPRECATED}>DEPRECATED</option>
      </select>
      {isPending && <span className="text-[10px] text-cyan-400 font-mono animate-pulse">saving...</span>}
    </div>
  );
}
