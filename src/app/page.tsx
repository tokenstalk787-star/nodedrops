
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { HomeHero } from "@/components/home/hero";
import { StatsStrip } from "@/components/home/stats-strip";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedOpportunityCard } from "@/components/home/featured-opportunity-card";

export default async function HomePage() {
  await connection();

  const realOpportunityFilter = {
    isDemo: false,
    slug: { not: "example-testnet" },
  } as const;

  const [total, active, verified, opportunities] =
    await Promise.all([
      prisma.opportunity.count({
        where: realOpportunityFilter,
      }),
      prisma.opportunity.count({
        where: {
          ...realOpportunityFilter,
          status: "ACTIVE",
        },
      }),
      prisma.opportunity.count({
        where: {
          ...realOpportunityFilter,
          lastVerifiedAt: { not: null },
          sourceUrl: { not: null },
          verificationNotes: { not: null },
        },
      }),
      prisma.opportunity.findMany({
        where: realOpportunityFilter,
        orderBy: [
          { updatedAt: "desc" },
          { name: "asc" },
        ],
        take: 3,
        select: {
          id: true,
          name: true,
          slug: true,
          summary: true,
          category: true,
          network: true,
          status: true,
          incentiveStatus: true,
          lastVerifiedAt: true,
          sourceUrl: true,
        },
      }),
    ]);

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <HomeHero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StatsStrip
          total={total}
          active={active}
          verified={verified}
        />

        <CategoryGrid />

        <section
          id="featured"
          className="py-16 sm:py-20"
          aria-labelledby="featured-heading"
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
                Explore opportunities
              </p>
              <h2
                id="featured-heading"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Recently updated
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Discover testnets, node programs and developer
                opportunities. Always check official sources before
                committing time or money.
              </p>
            </div>

            <Link
              href="/opportunities"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-300"
            >
              Browse all opportunities
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {opportunities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opportunity) => (
                <FeaturedOpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xl text-emerald-300">
                ↗
              </div>
              <h3 className="text-lg font-semibold">
                Your next opportunity starts here
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                We are preparing source-backed listings. Check back
                soon, and always verify program details through
                official project channels.
              </p>
              <Link
                href="/opportunities"
                className="mt-5 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Explore directory
              </Link>
            </div>
          )}
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.10] via-[#101820] to-[#0d1017] p-6 sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-emerald-400/10 blur-3xl"
            />

            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Built for Web3 builders
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Spend less time searching.
                  <br className="hidden sm:block" /> More time building.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Find potential opportunities, understand requirements
                  and use official sources to plan your next move.
                  Rewards are never guaranteed.
                </p>
              </div>

              <Link
                href="/opportunities"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Explore NodeDrops <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} NodeDrops.xyz</p>
          <p>
            Independent discovery platform. No reward or airdrop is
            guaranteed.
          </p>
        </div>
      </footer>
    </main>
  );
}
