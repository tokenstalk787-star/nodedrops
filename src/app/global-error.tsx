"use client";

import React, { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("NodeDrops Global Layout Exception:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0b101d] border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Application Error
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A root layout context error occurred. Please click below to reload the page.
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-slate-500">
                Digest: {error.digest}
              </p>
            )}
          </div>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-cyan-500/20"
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
