import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  getGuideBySlug,
  getAllGuides,
  incrementGuideViewCount,
} from "@/lib/repositories/guide.repository";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ReviewMetadata } from "@/components/guide/ReviewMetadata";
import { GuideTableOfContents } from "@/components/guide/GuideTableOfContents";
import {
  GuideContentRenderer,
  extractTocFromMarkdown,
} from "@/components/guide/GuideContentRenderer";
import { HardwareRequirements } from "@/components/guide/HardwareRequirements";
import { SourceList } from "@/components/guide/SourceList";
import { RelatedGuides } from "@/components/guide/RelatedGuides";
import { WarningNotice } from "@/components/guide/WarningNotice";
import { VerificationStatusBadge } from "@/components/network/VerificationStatus";
import { Server, Globe, BookOpen, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface GuideDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide Not Found | NodeDrops",
      description: "The requested node deployment runbook could not be found.",
    };
  }

  const primaryNetwork = guide.guideNetworks[0]?.network;
  const networkName = primaryNetwork ? ` for ${primaryNetwork.name}` : "";

  return {
    title: `${guide.title} | NodeDrops`,
    description: guide.summary,
    openGraph: {
      title: `${guide.title} | NodeDrops`,
      description: guide.summary,
      type: "article",
      url: `https://nodedrops.xyz/guides/${guide.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title}${networkName}`,
      description: guide.summary,
    },
  };
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Fire view count increment without blocking page response
  incrementGuideViewCount(guide.id).catch(() => {});

  const primaryNetwork = guide.guideNetworks[0]?.network;
  const hardware = primaryNetwork?.hardwareRequirements?.[0];

  // Fetch related guides
  const allGuides = await getAllGuides({ limit: 4 });
  const relatedGuides = allGuides.filter((g) => g.id !== guide.id);

  // Extract TOC headings
  const tocItems = extractTocFromMarkdown(guide.content);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: guide.title, href: `/guides/${guide.slug}`, current: true },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Guide Header Banner */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge
              variant={
                guide.difficulty === "BEGINNER"
                  ? "success"
                  : guide.difficulty === "INTERMEDIATE"
                  ? "info"
                  : "purple"
              }
              size="md"
            >
              {guide.difficulty} Runbook
            </Badge>

            {primaryNetwork && (
              <Link href={`/networks/${primaryNetwork.slug}`}>
                <Badge variant="cyan" size="md" className="hover:border-cyan-400 transition-colors">
                  <Server className="w-3.5 h-3.5 mr-1" />
                  {primaryNetwork.name}
                </Badge>
              </Link>
            )}

            {guide.category && (
              <Link href={`/categories/${guide.category.slug}`}>
                <Badge variant="neutral" size="md" className="hover:border-slate-500 transition-colors">
                  <Layers className="w-3.5 h-3.5 mr-1" />
                  {guide.category.name}
                </Badge>
              </Link>
            )}

            <VerificationStatusBadge
              status={guide.verificationStatus}
              verifiedDate={guide.verifiedAt}
              size="md"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed">
            {guide.summary}
          </p>

          <ReviewMetadata
            difficulty={guide.difficulty}
            estimatedMinutes={guide.estimatedMinutes}
            verificationStatus={guide.verificationStatus}
            verifiedAt={guide.verifiedAt}
            authorName={guide.author?.name}
            updatedAt={guide.updatedAt}
          />
        </header>

        {/* Production Warning Notice */}
        {primaryNetwork?.networkType === "MAINNET" ? (
          <WarningNotice title="Mainnet Environment Notice">
            This runbook operates on a production blockchain network. Real economic funds, node reputation, and cryptographic validator keys are involved. Ensure your hardware matches verified specifications before proceeding.
          </WarningNotice>
        ) : (
          <WarningNotice title="Public Testnet Runbook">
            This setup deploys to a public testnet. Always test configuration changes and client upgrades on testnets prior to mainnet execution.
          </WarningNotice>
        )}

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Runbook Body */}
          <main className="lg:col-span-8 space-y-8">
            {/* Empirical Hardware Baselines if available */}
            {hardware && (
              <div id="hardware-requirements" className="scroll-mt-24">
                <HardwareRequirements
                  hardware={{
                    minCpu: hardware.minCpu,
                    recCpu: hardware.recCpu,
                    minRamGb: hardware.minRamGb,
                    recRamGb: hardware.recRamGb,
                    minStorageGb: hardware.minStorageGb,
                    recStorageGb: hardware.recStorageGb,
                    storageType: hardware.storageType,
                    bandwidthMbps: hardware.bandwidthMbps,
                    notes: hardware.notes,
                  }}
                  nodeType={hardware.nodeType}
                />
              </div>
            )}

            {/* Structured Guide Content */}
            <article className="prose prose-invert max-w-none">
              <GuideContentRenderer content={guide.content} />
            </article>

            {/* Official Upstream Sources */}
            {guide.guideSources && guide.guideSources.length > 0 && (
              <div id="official-sources" className="scroll-mt-24">
                <SourceList sources={guide.guideSources} />
              </div>
            )}
          </main>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Table of Contents */}
            <GuideTableOfContents items={tocItems} />

            {/* Related Network Quick Card */}
            {primaryNetwork && (
              <Card className="border-slate-800 bg-[#070b16]">
                <CardHeader className="pb-3 border-b border-slate-800">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>Target Network Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Network</span>
                    <span className="font-semibold text-white">{primaryNetwork.name}</span>
                  </div>
                  {primaryNetwork.chainId && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-400">Chain ID</span>
                      <span className="text-cyan-400">{primaryNetwork.chainId}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Consensus</span>
                    <span className="text-slate-200">{primaryNetwork.consensus}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Type</span>
                    <span className="text-slate-200">{primaryNetwork.networkType}</span>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    {primaryNetwork.docsUrl && (
                      <a
                        href={primaryNetwork.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-cyan-400 text-xs font-medium transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Official Documentation</span>
                      </a>
                    )}
                    {primaryNetwork.websiteUrl && (
                      <a
                        href={primaryNetwork.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Project Website</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>

        {/* Related Runbooks */}
        <RelatedGuides guides={relatedGuides} currentGuideId={guide.id} />
      </div>
    </div>
  );
}
