import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Server,
  Layers,
  Cpu,
  FileCode2,
  Terminal,
  Activity,
  HardDrive,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { HomeSearch } from "@/components/home/HomeSearch";
import {
  ECOSYSTEMS_DATA,
  FEATURED_NETWORKS,
  LATEST_GUIDES,
  NODE_TYPES_DATA,
} from "@/data/mock-homepage";

export const metadata = {
  title: "NodeDrops — Your Guide to Running Blockchain Nodes",
  description:
    "Discover blockchain networks and learn how to deploy, configure, operate, verify, and troubleshoot full nodes, validators, and RPC endpoints.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ========================================================
          1 & 2 & 3 & 4 & 5: HERO SECTION
          - Heading: "Your Guide to Running Blockchain Nodes"
          - Supporting research description
          - Prominent Global Search
          - Primary Call-to-Actions (Explore Testnets, Mainnets, Guides)
         ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-[#0e1424]/60 via-[#0a0d14] to-[#0a0d14]">
        {/* Subtle background glow effect */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 blur-[100px] rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2">
            <Badge variant="cyan" size="md" withDot withPing>
              Research-First Web3 Infrastructure Platform
            </Badge>
          </div>

          {/* Hero Heading */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Your Guide to Running{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Blockchain Nodes
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover Layer 1 and Layer 2 networks. Learn how to deploy, configure, operate,
              verify, and troubleshoot full nodes, validators, and RPC endpoints with production-ready runbooks.
            </p>
          </div>

          {/* Prominent Global Search Component */}
          <HomeSearch className="pt-2" />

          {/* Working Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/testnets">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Testnets
              </Button>
            </Link>

            <Link href="/mainnets">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Server className="w-4 h-4 text-cyan-400" />}
              >
                Explore Mainnets
              </Button>
            </Link>

            <Link href="/guides">
              <Button
                variant="outline"
                size="md"
                leftIcon={<FileCode2 className="w-4 h-4 text-slate-400" />}
              >
                Browse Runbooks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          6: ECOSYSTEM BROWSING SECTION
          - Major chains (Ethereum, Arbitrum, Optimism, Base, Solana, Polygon)
         ======================================================== */}
      <section className="py-14 border-b border-slate-800/80 bg-[#07090f]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Multi-Chain Coverage
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Browse by Ecosystem
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore supported blockchain architectures from EVM rollups to high-throughput Layer 1s.
              </p>
            </div>
            <Link href="/networks">
              <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                All Ecosystems
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {ECOSYSTEMS_DATA.map((eco) => (
              <Link
                key={eco.id}
                href={`/networks?q=${encodeURIComponent(eco.name)}`}
                className="group flex flex-col justify-between p-4 rounded-xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#121a30] transition-all hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {eco.symbol}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {eco.layer}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                    {eco.name}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
                  {eco.nodeCountEstimate}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7: FEATURED NETWORKS SECTION
          - Real client hardware requirements
          - Node sync status
         ======================================================== */}
      <section className="py-16 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Node Directories
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Featured Networks
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Production-verified hardware requirements, client software, and consensus architectures.
              </p>
            </div>
            <Link href="/networks">
              <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Networks
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_NETWORKS.map((net) => (
              <Card key={net.id} hoverable glow="cyan">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={net.type === "Mainnet" ? "info" : "cyan"}
                      size="sm"
                      withDot={net.type === "Mainnet"}
                    >
                      {net.type} • {net.category}
                    </Badge>
                    <span className="text-xs font-mono text-emerald-400 font-medium">
                      {net.syncStatus}
                    </span>
                  </div>
                  <CardTitle className="mt-3 text-lg">{net.name}</CardTitle>
                  <CardDescription>Ecosystem: {net.ecosystem}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Hardware requirements snippet */}
                  <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800/80 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Cpu className="w-3 h-3 text-cyan-400" /> CPU:
                      </span>
                      <span className="text-slate-200">{net.minHardware.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-blue-400" /> RAM:
                      </span>
                      <span className="text-slate-200">{net.minHardware.ram}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <HardDrive className="w-3 h-3 text-violet-400" /> Disk:
                      </span>
                      <span className="text-slate-200">{net.minHardware.storage}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Client pairs: </span>
                    {net.primaryClients.join(", ")}
                  </div>
                </CardContent>

                <CardFooter>
                  <span className="text-xs text-slate-400 font-medium">
                    {net.guidesCount} step-by-step guides
                  </span>
                  <Link href={`/networks?q=${encodeURIComponent(net.name)}`}>
                    <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Explore
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8: LATEST GUIDES & RUNBOOKS SECTION
         ======================================================== */}
      <section className="py-16 border-b border-slate-800/80 bg-[#07090f]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Deployment Runbooks
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Latest Node Runbooks
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Reproducible setup instructions, systemd configurations, and health checks.
              </p>
            </div>
            <Link href="/guides">
              <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Browse All Guides
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LATEST_GUIDES.map((guide) => (
              <Card key={guide.id} hoverable glow="blue">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Badge
                      variant={
                        guide.difficulty === "Beginner"
                          ? "success"
                          : guide.difficulty === "Intermediate"
                          ? "info"
                          : "purple"
                      }
                      size="sm"
                    >
                      {guide.difficulty}
                    </Badge>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>{guide.estimatedTime}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified {guide.lastVerified}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="mt-3 text-lg leading-snug">
                    {guide.title}
                  </CardTitle>
                  <CardDescription>
                    Network: <span className="text-cyan-400 font-semibold">{guide.network}</span> • Type: {guide.nodeType}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {guide.summary}
                  </p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs font-mono text-slate-500">
                    ID: {guide.slug}
                  </span>
                  <Link href="/guides">
                    <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Read Runbook
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          9: NODE-TYPE CATEGORIES SECTION
          - Full nodes, Validator nodes, Archive nodes, RPC nodes, Sequencers
         ======================================================== */}
      <section className="py-16 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Infrastructure Taxonomies
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Understand Node Classifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Each node role has distinct hardware demands, consensus responsibilities, and storage profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NODE_TYPES_DATA.map((type) => (
              <Card key={type.id} hoverable glow="violet">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="purple" size="sm">
                      {type.badge}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      Tier: {type.hardwareTier}
                    </span>
                  </div>
                  <CardTitle className="mt-3 text-lg">{type.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 text-xs space-y-1.5">
                    <div className="text-slate-300">
                      <span className="text-slate-500 font-semibold">Primary Role: </span>
                      {type.role}
                    </div>
                    <div className="text-slate-400 font-mono">
                      <span className="text-slate-500 font-sans font-semibold">Storage: </span>
                      {type.storageType}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/networks`} className="w-full">
                    <Button size="sm" variant="secondary" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Explore {type.title}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          10: CONTENT VERIFICATION & METHODOLOGY SECTION
          - Zero-trust security
          - Official upstream client documentation
          - Benchmark reproduction
         ======================================================== */}
      <section className="py-16 border-b border-slate-800/80 bg-[#07090f]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Research Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Content Verification &amp; Methodology
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We eliminate guesswork with testable, reproducible configurations sourced directly from official core developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-[#0e1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Upstream Source Policy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every client flag and configuration snippet is cross-referenced with official client source code and release tags.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Empirical Hardware Testing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Storage footprints, memory bloat, and I/O bottlenecks are verified through real sync tests on commodity bare metal and cloud VPS.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Zero-Trust Credential Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                NodeDrops never requests, collects, or manages private validator keys or server SSH credentials. Self-custody is absolute.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Continuous Audit Cycle</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All runbooks display visible verification timestamps and are flagged for immediate re-audit upon upstream protocol hard forks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          11: FINAL CALL TO ACTION (CTA)
         ======================================================== */}
      <section className="py-16 lg:py-20 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-violet-500/5"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <Badge variant="cyan" size="md" withDot>
            Start Operating Today
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to deploy your first blockchain node?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Choose a network, inspect minimum hardware specs, and follow verified runbooks to sync your node with the decentralized web.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/networks">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Terminal className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Find Your Network
              </Button>
            </Link>
            <Link href="/testnets">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Layers className="w-4 h-4 text-cyan-400" />}
              >
                Launch on Testnet
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
