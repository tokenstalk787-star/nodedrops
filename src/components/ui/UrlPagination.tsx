"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Pagination } from "./Pagination";

export interface UrlPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function UrlPagination({
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
