"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Pagination } from "./Pagination";

export interface UrlPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

function UrlPaginationInternal({
  currentPage,
  totalPages,
  className,
}: UrlPaginationProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className={className}
    />
  );
}

export function UrlPagination(props: UrlPaginationProps) {
  return (
    <Suspense
      fallback={<div className="h-10 w-48 mx-auto rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />}
    >
      <UrlPaginationInternal {...props} />
    </Suspense>
  );
}
