
import type { Metadata } from "next";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { OpportunityDirectory } from "@/components/opportunity-directory";

export const metadata: Metadata = {
  title: "Explore Web3 Opportunities",
  description:
    "Discover blockchain testnets, node programs and developer opportunities. Compare status, incentive information and official project sources.",
  alternates: {
    canonical: "/opportunities",
  },
};

type PageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    status?: string | string[];
    incentiveStatus?: string | string[];
  }>;
};

function getSingleValue(
  value: string | string[] | undefined,
): string {
  return typeof value === "string" ? value : "";
}

export default async function OpportunitiesPage({
  searchParams,
}: PageProps) {
  await connection();

  const params = await searchParams;

  const initialFilters = {
    q: getSingleValue(params.q),
    category: getSingleValue(params.category),
    status: getSingleValue(params.status),
    incentiveStatus: getSingleValue(params.incentiveStatus),
  };

  const records = await prisma.opportunity.findMany({
    where: {
      isDemo: false,
      slug: { not: "example-testnet" },
    },
    orderBy: [
      { updatedAt: "desc" },
      { name: "asc" },
    ],
    take: 500,
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      category: true,
      network: true,
      status: true,
      incentiveStatus: true,
      difficulty: true,
      estimatedCostUsd: true,
      officialUrl: true,
      logoUrl: true,
      sourceUrl: true,
      lastVerifiedAt: true,
      verificationNotes: true,
    },
  });

  const opportunities = records.map((item) => ({
    ...item,
    estimatedCostUsd: item.estimatedCostUsd?.toString() ?? null,
    lastVerifiedAt: item.lastVerifiedAt?.toISOString() ?? null,
  }));

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <section className="border-b border-white/[0.07] bg-gradient-to-b from-emerald-400/[0.06] to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
            NodeDrops directory
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Explore opportunities
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Discover testnets, node programs and developer campaigns.
            Review project details and verify claims through official
            sources before participating.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <OpportunityDirectory
          opportunities={opportunities}
          initialFilters={initialFilters}
        />
      </div>
    </main>
  );
}
