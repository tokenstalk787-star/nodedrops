import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  FileCheck2,
  ShieldCheck,
  Clock,
  Layers,
  Archive,
  AlertTriangle,
  GitPullRequest,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Content Methodology & Verification Standards — NodeDrops",
  description:
    "Learn about our source tiering hierarchy, verification statuses, 90-day review cycles, errata submission procedures, and guide retirement policies.",
  openGraph: {
    title: "Content Methodology & Verification Standards — NodeDrops",
    description:
      "How NodeDrops verifies blockchain node runbooks, grades documentation sources, and ensures technical accuracy.",
    url: "https://nodedrops.xyz/methodology",
  },
};

export default function MethodologyPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Methodology", href: "/methodology", current: true },
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
              <FileCheck2 className="w-3.5 h-3.5 mr-1" />
              Quality Framework
            </Badge>
            <Badge variant="neutral" size="md">
              Peer-Reviewed Documentation
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Documentation Methodology &amp; Quality Standards
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Running a blockchain node is high-stakes infrastructure engineering. A single mistyped port or incorrect genesis parameter can lead to out-of-sync nodes or validator slashing. Here is how we verify, review, and maintain our runbooks.
          </p>
        </header>

        {/* 1. Source Tiering Hierarchy */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>1. Upstream Source Tiering &amp; Quality Hierarchy</span>
            </h2>
            <p className="text-sm text-slate-400">
              Not all online tutorials are created equal. Every technical claim on NodeDrops must originate from an accredited source tier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-800 bg-[#070b16] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="success" size="sm">Tier 1: Canonical</Badge>
                <span className="text-[11px] font-mono text-emerald-400">100% Trust</span>
              </div>
              <h3 className="font-semibold text-white text-base">Core Protocol Specifications</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Official protocol GitHub repositories, EIP/BIP/RIP specification documents, and client consensus test suites (e.g. ethereum/consensus-specs, solana-labs/solana).
              </p>
            </Card>

            <Card className="border-slate-800 bg-[#070b16] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="info" size="sm">Tier 2: Foundation</Badge>
                <span className="text-[11px] font-mono text-cyan-400">95% Trust</span>
              </div>
              <h3 className="font-semibold text-white text-base">Client Developer Documentation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Documentation maintained by primary client engineering teams (e.g. docs.prylabs.network, geth.ethereum.org, docs.arbitrum.io, docs.base.org).
              </p>
            </Card>

            <Card className="border-slate-800 bg-[#070b16] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="warning" size="sm">Tier 3: Releases</Badge>
                <span className="text-[11px] font-mono text-amber-400">90% Trust</span>
              </div>
              <h3 className="font-semibold text-white text-base">Release Notes &amp; Commits</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                GitHub release changelogs, pull requests detailing breaking CLI flag changes, and network upgrade (hardfork) coordination threads.
              </p>
            </Card>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">Disallowed Sources: </span>
              <span>
                NodeDrops strictly rejects unverified medium posts, speculative crypto forum threads, affiliate referral tutorials, and AI-generated text without reproducible code references.
              </span>
            </div>
          </div>
        </section>

        {/* 2. Verification Status Taxonomy */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>2. Verification Status Definitions</span>
            </h2>
            <p className="text-sm text-slate-400">
              Every guide displays a clear badge indicating its exact verification maturity level.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">SETUP TESTED</Badge>
                <span className="text-xs font-semibold text-white">Highest Reliability</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The runbook has been executed on physical bare-metal hardware or isolated cloud virtual machines by maintainers. The node was synchronized past the genesis block and verified against live RPC endpoints.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="cyan" size="sm">OFFICIAL DOCS VERIFIED</Badge>
                <span className="text-xs font-semibold text-white">Document-Vetted</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All CLI parameters, systemd service units, and configuration files have been verified line-by-line against current upstream core developer documentation and latest git tags.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="purple" size="sm">COMMUNITY REPORTED</Badge>
                <span className="text-xs font-semibold text-white">Community Validated</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Contributed by independent node operators who have run the configuration in production. Pending formal reproduction in NodeDrops staging environments.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="warning" size="sm">UNDER REVIEW</Badge>
                <span className="text-xs font-semibold text-white">Draft / Re-Audit</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Newly submitted or flagged due to an upstream protocol hardfork. Operators are advised to exercise caution and test in devnet/testnet first.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 90-Day Freshness SLA & Continuous Audit Cycle */}
        <section className="rounded-2xl border border-slate-800 bg-[#080d1a] p-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 font-mono">
              <Clock className="w-4 h-4" />
              <span>Continuous Maintenance &bull; 90-Day Freshness Cycle</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Blockchain software changes rapidly. Outdated docs are dangerous.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every published guide on NodeDrops is monitored by our administrative verification queue. If a guide goes 90 days without an active review, our system flags it as <strong>Needs Review</strong>.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              During each re-audit, our maintainers verify:
            </p>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Compatibility with the latest stable client releases.</li>
              <li>Deprecation of old command-line arguments.</li>
              <li>Updates to snapshot providers, bootnode lists, or checkpoint sync URLs.</li>
              <li>Adjustment of recommended hardware specs based on real-world state growth.</li>
            </ul>
          </div>
        </section>

        {/* 4. Errata & Community Corrections */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-purple-400" />
              <span>4. Submitting Corrections &amp; Technical Errata</span>
            </h2>
            <p className="text-sm text-slate-400">
              Community scrutiny makes documentation resilient. Here is how we process community errata.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-2">
              <div className="font-mono text-cyan-400 text-sm font-bold">Step 01</div>
              <h3 className="font-semibold text-white text-sm">Report via Form</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit the affected runbook slug and description through our <Link href="/contact" className="text-cyan-400 underline">Contact Desk</Link>.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-2">
              <div className="font-mono text-cyan-400 text-sm font-bold">Step 02</div>
              <h3 className="font-semibold text-white text-sm">Maintainer Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintainers reproduce the discrepancy against the upstream release tag and test environment within 24–48 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-2">
              <div className="font-mono text-cyan-400 text-sm font-bold">Step 03</div>
              <h3 className="font-semibold text-white text-sm">Revision &amp; Audit Log</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The runbook is updated, a new verification date is stamped, and an audit trail entry is permanently recorded.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Deprecation & Retiring Outdated Guides */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Archive className="w-5 h-5 text-amber-400" />
              <span>5. Deprecation &amp; Guide Retirement Policy</span>
            </h2>
            <p className="text-sm text-slate-400">
              When networks or architectures reach end-of-life, we preserve historical truth without misleading operators.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When a network shuts down (e.g. Ethereum Goerli, Ropsten) or client teams replace a binary entirely, we execute our safe deprecation protocol:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800/80 space-y-1.5">
                <span className="font-semibold text-amber-400 font-mono block">Prominent Warning Banner</span>
                <span>The guide remains reachable via direct link to preserve research citations, but displays a permanent warning banner explaining why the network or client is deprecated.</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800/80 space-y-1.5">
                <span className="font-semibold text-cyan-400 font-mono block">Forward Migration Pointer</span>
                <span>A direct link directs operators to the active network replacement (e.g. directing former Goerli operators to Holesky or Sepolia).</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0e1424] to-[#070b16] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Found a documentation discrepancy?</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Help us maintain high technical standards by submitting an errata report.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Submit Errata to Maintainers
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
