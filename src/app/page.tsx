import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Server,
  FileCode2,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HomeSearch } from "@/components/home/HomeSearch";
import { HeroInteractiveTerminal } from "@/components/home/HeroInteractiveTerminal";
import { LiveMetricsBar } from "@/components/home/LiveMetricsBar";
import { InteractiveNetworkShowcase } from "@/components/home/InteractiveNetworkShowcase";
import { HomeCapacityWidget } from "@/components/home/HomeCapacityWidget";
import { GuideCard } from "@/components/guide/GuideCard";
import prisma from "@/lib/prisma";
import { getAllNetworks } from "@/lib/repositories/network.repository";
import { getAllGuides } from "@/lib/repositories/guide.repository";
import { NetworkStatus, PublicationStatus } from "@prisma/client";

// Ensure this page is dynamically server-rendered with real-time TiDB Cloud database data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "NodeDrops — Your Guide to Running Blockchain Nodes",
  description:
    "Discover blockchain networks and learn how to deploy, configure, operate, verify, and troubleshoot full nodes, validators, and RPC endpoints.",
};

export default async function HomePage() {
  // Fetch real live records directly from TiDB Cloud
  const [networks, guides, categories, networksCount, guidesCount, clientsCount, sourcesCount] =
    await Promise.all([
      getAllNetworks({ status: NetworkStatus.ACTIVE }),
      getAllGuides({ status: PublicationStatus.PUBLISHED, limit: 6 }),
      prisma.category.findMany({
        include: { _count: { select: { guides: true } } },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.network.count({ where: { status: NetworkStatus.ACTIVE } }),
      prisma.guide.count({ where: { publicationStatus: PublicationStatus.PUBLISHED } }),
      prisma.clientSoftware.count(),
      prisma.source.count(),
    ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-100">
      {/* ========================================================
          1. HERO SECTION (Split Grid: Copy + Search + Live Terminal)
         ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-18 lg:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-[#0c1324]/70 via-[#070b16] to-[#030712]">
        {/* Ambient neon radial glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-violet-500/15 blur-[120px] rounded-full"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-40 right-10 w-[450px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Value Proposition, Search */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Dynamic Live Status Pill */}
              <div className="inline-flex items-center gap-2">
                <Badge variant="cyan" size="md" withDot withPing>
                  Live Web3 Node Infrastructure Directory
                </Badge>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                Your Guide to Running{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  Blockchain Nodes
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Discover Layer 1 and Layer 2 networks. Deploy, configure, verify, and operate full nodes, validators, and RPC endpoints with production-tested runbooks and hardware baselines.
              </p>

              {/* Global Search Component */}
              <HomeSearch className="pt-1" />

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/networks">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Explore Directory
                  </Button>
                </Link>

                <Link href="/guides">
                  <Button
                    variant="secondary"
                    size="md"
                    leftIcon={<FileCode2 className="w-4 h-4 text-cyan-400" />}
                  >
                    Browse Runbooks
                  </Button>
                </Link>

                <Link href="/tools">
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<Cpu className="w-4 h-4 text-violet-400" />}
                  >
                    Hardware Tools
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Live Interactive Web3 Terminal */}
            <div className="lg:col-span-6">
              <HeroInteractiveTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. LIVE METRICS PULSE BAR
         ======================================================== */}
      <LiveMetricsBar
        networksCount={networksCount}
        guidesCount={guidesCount}
        clientsCount={clientsCount}
        sourcesCount={sourcesCount}
      />

      {/* ========================================================
          3. INTERACTIVE NETWORK SHOWCASE (With Official Logos)
         ======================================================== */}
      <section className="py-16 border-b border-slate-800/80 bg-[#050813]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Dynamic Blockchain Directory
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Supported Networks &amp; Hardware Baselines
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Filter chains dynamically. Inspect official client packages, consensus models, and empirical hardware specs.
              </p>
            </div>

            <Link href="/networks">
              <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Full Directory ({networksCount})
              </Button>
            </Link>
          </div>

          {/* Interactive Client Showcase with instant filter pills & official logos */}
          <InteractiveNetworkShowcase initialNetworks={networks} />
        </div>
      </section>

      {/* ========================================================
          4. INTERACTIVE CAPACITY ESTIMATOR WIDGET
         ======================================================== */}
      <section className="py-14 border-b border-slate-800/80 bg-[#04060c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeCapacityWidget />
        </div>
      </section>

      {/* ========================================================
          5. LATEST PRODUCTION RUNBOOKS (Real TiDB Cloud Data)
         ======================================================== */}
      <section className="py-16 border-b border-slate-800/80 bg-[#070b16]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Deployment Runbooks
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Verified Node Setup Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Deterministic step-by-step guides with copyable Docker/Systemd snippets and sanity checks.
              </p>
            </div>

            <Link href="/guides">
              <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                All Runbooks ({guidesCount})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. NODE ROLES & ARCHITECTURE CATEGORIES
         ======================================================== */}
      <section className="py-16 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Role Taxonomy
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Browse by Node Role
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select your intended operational duty: from validation and staking to high-volume RPC routing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group p-5 rounded-2xl bg-[#070b16] border border-slate-800/80 hover:border-cyan-500/50 hover:bg-[#0c1224] transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
                    <Server className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{cat._count.guides} guides</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
