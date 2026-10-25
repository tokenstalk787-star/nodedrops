import Link from "next/link";
import { Terminal, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col justify-center items-center px-4 py-16 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-4xl w-full mx-auto text-center space-y-8">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-xs font-mono tracking-wide">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>PHASE 00–01: ENVIRONMENT & FOUNDATION INITIALIZED</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
          Your Guide to Running{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            Blockchain Nodes
          </span>
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          Discover verified blockchain networks, follow reproducible setup instructions,
          and learn node operations with documented hardware requirements and official sources.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/testnets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10"
          >
            Explore Testnets
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/mainnets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-200 font-medium hover:bg-slate-800 transition-colors"
          >
            Explore Mainnets
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-800 bg-slate-950/40 text-slate-400 font-medium hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            Browse Guides
          </Link>
        </div>

        {/* Foundation Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">Reproducible Setup</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Step-by-step verified installation commands, configuration files, and expected outputs.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">Hardware & Sizing</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Documented CPU, RAM, storage, and network bandwidth requirements per node role.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">Source-Verified</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Official documentation links, test dates, and transparent verification statuses.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
