"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for observability
    console.error("NodeDrops Runtime Exception:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#0b101d] border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Something unexpected occurred
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The application encountered a transient layout or runtime issue. Your session and data remain secure.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-500">
              Error Digest: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => reset()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
