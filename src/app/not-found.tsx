
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="eyebrow">ERROR 404</p>

      <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">
        Page not found
      </h1>

      <p className="muted mt-5 max-w-xl leading-7">
        This page may have moved, the URL may be incorrect, or the
        opportunity may no longer be available.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
        >
          Go home
        </Link>

        <Link
          href="/opportunities"
          className="rounded-xl border border-white/15 px-5 py-3 font-semibold transition hover:bg-white/5"
        >
          Browse opportunities
        </Link>
      </div>
    </main>
  );
}
