
import Link from "next/link";

type FeaturedOpportunity = {
  name: string;
  slug: string;
  summary: string;
  category: string;
  network: string | null;
  status: string;
  incentiveStatus: string;
  lastVerifiedAt: Date | null;
  sourceUrl: string | null;
};

type FeaturedOpportunityCardProps = {
  opportunity: FeaturedOpportunity;
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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function FeaturedOpportunityCard({
  opportunity,
}: FeaturedOpportunityCardProps) {
  const hasVerificationEvidence = Boolean(
    opportunity.lastVerifiedAt && opportunity.sourceUrl,
  );

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#10131a] p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-[#131923] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
          {opportunity.category}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${
            opportunity.status === "ACTIVE"
              ? "bg-emerald-400/10 text-emerald-300"
              : opportunity.status === "ENDED"
                ? "bg-slate-400/10 text-slate-400"
                : "bg-amber-400/10 text-amber-300"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {statusLabels[opportunity.status] ?? opportunity.status}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
        <Link
          href={`/opportunities/${encodeURIComponent(opportunity.slug)}`}
          className="rounded-sm outline-none transition hover:text-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {opportunity.name}
        </Link>
      </h3>

      {opportunity.network && (
        <p className="mt-1 text-xs text-slate-500">
          Network: {opportunity.network}
        </p>
      )}

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
        {opportunity.summary}
      </p>

      <div className="mt-5 border-t border-white/[0.07] pt-4">
        <p
          className={`text-xs font-medium ${
            opportunity.incentiveStatus === "CONFIRMED"
              ? "text-emerald-300"
              : opportunity.incentiveStatus === "POTENTIAL"
                ? "text-amber-300"
                : "text-slate-400"
          }`}
        >
          {incentiveLabels[opportunity.incentiveStatus] ??
            opportunity.incentiveStatus}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {hasVerificationEvidence && opportunity.lastVerifiedAt ? (
            <span className="text-xs text-slate-500">
              Verified {formatDate(opportunity.lastVerifiedAt)}
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Source verification pending
            </span>
          )}

          <Link
            href={`/opportunities/${encodeURIComponent(opportunity.slug)}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 transition group-hover:text-emerald-200"
          >
            View details <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
