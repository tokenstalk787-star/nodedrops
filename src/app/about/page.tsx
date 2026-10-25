import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Server,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  Globe,
  ArrowRight,
  HardDrive,
  Users,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About NodeDrops — Open Infrastructure Intelligence",
  description:
    "Learn about NodeDrops.xyz, our mission to decentralize blockchain infrastructure, our intended audience, and our educational non-commercial principles.",
  openGraph: {
    title: "About NodeDrops — Open Infrastructure Intelligence",
    description:
      "Our mission to decentralize blockchain infrastructure through reproducible, verified runbooks and transparent node tools.",
    url: "https://nodedrops.xyz/about",
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about", current: true },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Header */}
        <header className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="md">
              <Server className="w-3.5 h-3.5 mr-1" />
              Platform Mission
            </Badge>
            <Badge variant="neutral" size="md">
              Independent &bull; Vendor-Neutral
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Democratizing Blockchain Node Infrastructure
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            NodeDrops.xyz is an open educational directory and runbook repository designed to help software engineers, validators, and home lab operators deploy, operate, and maintain resilient blockchain nodes.
          </p>
        </header>

        {/* Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-800 bg-[#070b16]/90 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Verified Technical Truth</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every command, systemd configuration, and flag is cross-referenced with canonical core developer documentation and tested in staging environments before publication.
            </p>
          </Card>

          <Card className="border-slate-800 bg-[#070b16]/90 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Dual-Shell Runbooks</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Node setup should not assume an exclusive operating system. We provide verified instructions for both Linux/macOS Bash and Windows PowerShell environments.
            </p>
          </Card>

          <Card className="border-slate-800 bg-[#070b16]/90 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Deterministic Calculators</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No guesswork or arbitrary estimates. Our capacity planning tools provide explicit mathematical formulas for storage growth, bandwidth spikes, and 3-year TCO.
            </p>
          </Card>
        </section>

        {/* The Problem We Solve */}
        <section className="rounded-2xl border border-slate-800 bg-[#080d1a] p-8 sm:p-10 space-y-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
              <Compass className="w-4 h-4" />
              <span>Why We Built NodeDrops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Blockchain decentralization is only as strong as client diversity and accessible runbooks.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Most blockchain protocol documentation is fragmented across obscure GitHub gists, Discord pins, or outdated Medium articles with dead links and broken Docker compose templates. Operators face configuration traps, missed forks, and silent slashing risks.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              NodeDrops consolidates network profiles, client specifications, hardware prerequisites, and step-by-step verified execution runbooks into an open, community-curated technical atlas.
            </p>
          </div>
        </section>

        {/* Intended Audience */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Who NodeDrops Is For</span>
            </h2>
            <p className="text-sm text-slate-400">
              Designed specifically for technical operators across varying deployment environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <HardDrive className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-white text-base">Solo Stakers &amp; Home Lab Operators</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Running dedicated nodes at home on mini-PCs (NUCs, Beelink) or custom bare-metal servers. We provide realistic bandwidth planning, thermal considerations, and UPS battery backup advice.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Layers className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-white text-base">DevOps &amp; Infrastructure Engineers</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Operating dedicated RPC clusters, indexers, or sequencers in enterprise environments. We document systemd unit files, log rotation, Prometheus telemetry endpoints, and firewall rules.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Terminal className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-white text-base">Smart Contract &amp; DApp Developers</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Developers who need local testnet and mainnet archival nodes to query historical contract state, simulate transactions without public rate limits, and debug MEV interactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Globe className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-white text-base">Network Researchers &amp; Educators</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Students and blockchain researchers seeking accurate technical comparisons of consensus mechanisms, client resource footprints, and state growth metrics across ecosystems.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0e1424] to-[#070b16] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Explore Verified Node Documentation</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse our directory of Layer 1 and Layer 2 network specifications or test capacity requirements.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/networks">
              <Button variant="outline" size="sm">
                Browse Networks
              </Button>
            </Link>
            <Link href="/guides">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Read Runbooks
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
