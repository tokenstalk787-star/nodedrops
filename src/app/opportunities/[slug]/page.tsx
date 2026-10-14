
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const statusLabels: Record<string, string> = {
  UPCOMING: "Upcoming",
  ACTIVE: "Active",
  PAUSED: "Paused",
  ENDED: "Ended",
};

const incentiveLabels: Record<string, string> = {
  CONFIRMED: "Incentive confirmed",
  POTENTIAL: "Potential incentive",
  NOT_ANNOUNCED: "Not announced",
};

const statusStyles: Record<string, string> = {
  UPCOMING: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  ACTIVE: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  PAUSED: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  ENDED: "border-neutral-400/20 bg-neutral-400/10 text-neutral-300",
};

const incentiveStyles: Record<string, string> = {
  CONFIRMED: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  POTENTIAL: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  NOT_ANNOUNCED: "border-neutral-400/20 bg-neutral-400/10 text-neutral-300",
};

function formatDate(date: Date | null): string {
  if (!date) return "Not verified yet";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatCost(cost: { toString(): string } | null): string {
  if (cost == null) return "Not estimated";

  const amount = Number(cost.toString());

  if (!Number.isFinite(amount) || amount < 0) {
    return "Not estimated";
  }

  return `$${amount.toFixed(2)} USD`;
}

function isValidHttpUrl(value: string | null): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function DetailLoading() {
  return (
    <main className="container space-y-6 py-12" aria-label="Loading opportunity">
      <div className="h-4 w-40 animate-pulse rounded bg-white/10" />

      <section className="panel space-y-6 rounded-2xl p-6 md:p-10">
        <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
        <div className="h-10 max-w-xl animate-pulse rounded bg-white/10" />
        <div className="h-20 max-w-2xl animate-pulse rounded bg-white/10" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-white/10 bg-white/[0.02]"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

async function OpportunityDetails({ params }: PageProps) {
  const { slug } = await params;

  const opportunity = await prisma.opportunity.findFirst({
    where: {
      slug,
      isDemo: false,
      NOT: { slug: "example-testnet" },
    },
  });

  if (!opportunity) {
    notFound();
  }

  const status = opportunity.status;
  const incentiveStatus = opportunity.incentiveStatus;

  const statusLabel = statusLabels[status] ?? status;
  const incentiveLabel =
    incentiveLabels[incentiveStatus] ?? incentiveStatus;

  const statusStyle =
    statusStyles[status] ??
    "border-white/10 bg-white/5 text-neutral-300";

  const incentiveStyle =
    incentiveStyles[incentiveStatus] ??
    "border-white/10 bg-white/5 text-neutral-300";

  const cost = formatCost(opportunity.estimatedCostUsd);
  const lastVerified = formatDate(opportunity.lastVerifiedAt);

  const officialUrl = isValidHttpUrl(opportunity.officialUrl)
    ? opportunity.officialUrl
    : null;

  const sourceUrl = isValidHttpUrl(opportunity.sourceUrl)
    ? opportunity.sourceUrl
    : null;

  const verificationNotes = opportunity.verificationNotes?.trim() || null;

  // A date alone does not prove that the listing was independently verified.
  const hasVerificationEvidence = Boolean(
    opportunity.lastVerifiedAt && sourceUrl && verificationNotes,
  );

  return (
    <main className="container space-y-8 py-10 md:py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/"
          className="muted transition hover:text-white"
        >
          Home
        </Link>
        <span className="muted" aria-hidden="true">/</span>
        <Link
          href="/opportunities"
          className="muted transition hover:text-white"
        >
          Opportunities
        </Link>
        <span className="muted" aria-hidden="true">/</span>
        <span className="max-w-[200px] truncate text-neutral-300">
          {opportunity.name}
        </span>
      </nav>

      <section className="panel overflow-hidden rounded-2xl">
        <div className="space-y-6 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">{opportunity.category}</span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyle}`}
            >
              {statusLabel}
            </span>

            {opportunity.isDemo && (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
                Demo listing
              </span>
            )}
          </div>

          <header className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              {opportunity.name}
            </h1>

            <p className="muted text-base leading-7 md:text-lg">
              {opportunity.summary}
            </p>
          </header>

          {opportunity.isDemo && (
            <div
              role="note"
              className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-amber-100"
            >
              This is demonstration data for testing NodeDrops. It is not a
              verified real-world opportunity and should not be used to make
              participation or spending decisions.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 p-4">
              <p className="muted text-sm">Network</p>
              <p className="mt-2 font-medium">
                {opportunity.network || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 p-4">
              <p className="muted text-sm">Difficulty</p>
              <p className="mt-2 font-medium">
                {opportunity.difficulty || "Not assessed"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 p-4">
              <p className="muted text-sm">Estimated cost</p>
              <p className="mt-2 font-medium">{cost}</p>
              <p className="muted mt-1 text-xs">
                Estimate only; actual costs may vary.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 p-4 sm:col-span-2 lg:col-span-3">
              <p className="muted text-sm">Incentive status</p>

              <span
                className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${incentiveStyle}`}
              >
                {incentiveLabel}
              </span>

              <p className="muted mt-3 text-sm leading-6">
                Incentive status describes the information currently recorded
                for this listing. It is not a promise of tokens, NFTs, cash,
                eligibility, or future rewards. Check official terms before
                participating or spending money.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  Verification & evidence
                </h2>
                <p className="muted mt-1 text-sm">
                  Review the available evidence before participating.
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  hasVerificationEvidence
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                    : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                }`}
              >
                {hasVerificationEvidence
                  ? "Evidence recorded"
                  : "Evidence incomplete"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="muted text-sm">Last verification date</p>
                <p className="mt-1 font-medium">{lastVerified}</p>
              </div>

              <div>
                <p className="muted text-sm">Evidence source</p>

                {sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block break-all text-sm text-emerald-200 underline-offset-4 hover:underline"
                  >
                    Open source ↗
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-neutral-400">
                    No source provided
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="muted text-sm">Verification notes</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-300">
                {verificationNotes ??
                  "No verification notes have been recorded for this listing."}
              </p>
            </div>

            {!hasVerificationEvidence && (
              <p className="text-xs leading-5 text-amber-200/90">
                Verification is incomplete. A recorded date by itself does
                not establish that the claims or incentives have been checked
                against reliable official evidence.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-200"
              >
                Visit official website ↗
              </a>
            )}

            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-medium transition hover:bg-white/5"
            >
              Explore opportunities
            </Link>
          </div>
        </div>
      </section>

      <p className="muted text-xs leading-5">
        NodeDrops is an informational directory. Always independently verify
        project legitimacy, official URLs, eligibility requirements, and
        transaction costs before connecting a wallet or running software.
      </p>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const opportunity = await prisma.opportunity.findFirst({
    where: {
      slug,
      isDemo: false,
      NOT: { slug: "example-testnet" },
    },
    select: {
      name: true,
      summary: true,
    },
  });

  if (!opportunity) {
    return {
      title: "Opportunity Not Found | NodeDrops.xyz",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${opportunity.name} | NodeDrops.xyz`,
    description: opportunity.summary,
    robots: { index: true, follow: true },
  };
}

export default function OpportunityPage({ params }: PageProps) {
  return (
    <Suspense fallback={<DetailLoading />}>
      <OpportunityDetails params={params} />
    </Suspense>
  );
}
