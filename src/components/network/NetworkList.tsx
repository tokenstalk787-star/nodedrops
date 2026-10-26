"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { NetworkCard, NetworkWithRelations } from "./NetworkCard";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Server } from "lucide-react";

export interface NetworkListProps {
  networks: NetworkWithRelations[];
  total: number;
  totalPages: number;
  currentPage: number;
}

function NetworkListInternal({
  networks,
  total,
  totalPages,
  currentPage,
}: NetworkListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    const basePath = pathname || "/networks";
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname || "/networks");
  };

  if (networks.length === 0) {
    return (
      <EmptyState
        icon={<Server className="w-7 h-7 text-cyan-400" />}
        title="No Networks Found"
        description="No blockchain networks matched your active filter and search criteria. Try clearing filters or using broader search terms."
        actionLabel="Reset All Filters"
        onAction={handleReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>
          Showing <strong className="text-white">{networks.length}</strong> of{" "}
          <strong className="text-white">{total}</strong> networks
        </span>
        {totalPages > 1 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networks.map((network) => (
          <NetworkCard key={network.id} network={network} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pt-6 border-t border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export function NetworkList(props: NetworkListProps) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-[#0b101d] border border-slate-800" />
          ))}
        </div>
      }
    >
      <NetworkListInternal {...props} />
    </Suspense>
  );
}
