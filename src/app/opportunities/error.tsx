
"use client";

import { useEffect } from "react";

type OpportunitiesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function OpportunitiesError({
  error,
  reset,
}: OpportunitiesErrorProps) {
  useEffect(() => {
    console.error("Opportunities directory error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#090b10] px-4 py-16 text-white">
      <section
        role="alert"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#10131a] p-7 text-center sm:p-9"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-xl text-rose-300">
          !
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          We couldn&apos;t load opportunities
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Something went wrong while loading the directory. Please
          try again. Your saved opportunities and account data have
          not been changed by this action.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-slate-500">
            Error reference: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
