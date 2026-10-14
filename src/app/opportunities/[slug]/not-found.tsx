
import Link from "next/link";

export default function OpportunityNotFound() {
  return (
    <main className="container flex min-h-[65vh] items-center justify-center py-16">
      <section className="panel w-full max-w-2xl rounded-3xl p-8 text-center md:p-12">
        <p className="eyebrow">ERROR 404 · OPPORTUNITY NOT FOUND</p>

        <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
          This opportunity is missing.
        </h1>

        <p className="muted mx-auto mt-5 max-w-lg leading-7">
          The opportunity may have been removed, its URL may be incorrect,
          or the listing may no longer exist in our directory.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/opportunities"
            className="rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-200"
          >
            Explore opportunities
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium transition hover:bg-white/5"
          >
            Back to home
          </Link>
        </div>

        <p className="muted mt-8 text-xs">
          NodeDrops.xyz · Research before you participate.
        </p>
      </section>
    </main>
  );
}
