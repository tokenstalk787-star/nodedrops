"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the failure visible to observability tooling without exposing
    // internal error details to visitors.
    console.error("NodeDrops route error", error);
  }, [error]);

  return (
    <main className="container mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
        Something went wrong
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        This page could not be loaded
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
        The service may be temporarily unavailable. Try again; if the problem
        continues, return to the opportunity directory in a moment.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          Try again
        </button>
        <a
          href="/opportunities"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Browse opportunities
        </a>
      </div>
      {error.digest ? (
        <p className="mt-6 text-xs text-slate-500">
          Reference: {error.digest}
        </p>
      ) : null}
    </main>
  );
}
