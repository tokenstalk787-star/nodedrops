import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldAlert, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service & Operational Disclaimer — NodeDrops",
  description:
    "Terms of service detailing the educational purpose of NodeDrops, operational risk disclaimers, validator slashing considerations, and liability limitations.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service & Operational Disclaimer — NodeDrops",
    description:
      "Operational terms: educational runbooks, validator slashing warnings, hardware risks, and non-commercial disclaimers.",
    url: "https://nodedrops.xyz/terms",
  },
};

export default function TermsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Terms of Service", href: "/terms", current: true },
  ];

  const breadcrumbSchema = [
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Structured Data */}
      <JsonLd data={buildBreadcrumbSchema(breadcrumbSchema)} />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header Hero */}
        <header className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="md">
              <Scale className="w-3.5 h-3.5 mr-1" />
              Operational Terms
            </Badge>
            <Badge variant="neutral" size="md">
              Effective Date: October 2026
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service &amp; Operational Disclaimer
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Please read these terms carefully before utilizing our runbooks, technical configurations, or node capacity planning tools.
          </p>
        </header>

        {/* Prominent Risk Notice Card */}
        <Card className="border-amber-500/30 bg-amber-950/20 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>High-Risk Infrastructure Notice</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            Operating blockchain validators and full nodes involves genuine operational, cryptographic, and financial risks. Validator misconfiguration or duplicate key deployment can result in irrevocable capital slashing or inactivity penalties under network consensus rules. Always test setups thoroughly on public testnets before committing mainnet funds.
          </p>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">01.</span>
              <span>Educational &amp; Research Nature</span>
            </h2>
            <p>
              NodeDrops.xyz is an independent educational and open-source documentation directory. All guides, step-by-step commands, hardware estimates, and systemd templates are provided strictly for educational, informational, and research purposes.
            </p>
            <p className="text-slate-400">
              No content published on NodeDrops constitutes financial, investment, tax, legal, or commercial cryptographic advice.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">02.</span>
              <span>Operator Responsibilities &amp; Hardware Risks</span>
            </h2>
            <p>
              By executing any command or configuration referenced on NodeDrops, you acknowledge that you are solely responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
              <li>Securing your host machine, SSH endpoints, and firewall rules (<code className="text-cyan-300 font-mono">ufw</code> / Windows Defender).</li>
              <li>Monitoring hardware thermals, storage wear (TBW limits on NVMe drives), and ISP data cap policies.</li>
              <li>Maintaining power redundancy (uninterruptible power supply — UPS) for consensus-critical nodes.</li>
              <li>Verifying that network ports (e.g. RPC port 8545) are never exposed to public internet interfaces without authentication.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">03.</span>
              <span>Key Management &amp; Non-Custodial Stance</span>
            </h2>
            <p>
              NodeDrops operates on a strictly non-custodial, zero-access basis. We do not generate, process, store, or manage validator keystores, seed phrases, private keys, or wallet credentials.
            </p>
            <p className="text-slate-400">
              You must never enter validator seed phrases or private keys into any form, support channel, or web interface on NodeDrops.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">04.</span>
              <span>Calculators &amp; Mathematical Estimates</span>
            </h2>
            <p>
              The node tools provided on NodeDrops (including the Storage Estimator, Bandwidth Calculator, Hardware Checklist, and Cost Calculator) utilize simplified linear projection algorithms and published baseline parameters.
            </p>
            <p className="text-slate-400">
              Real-world blockchain state growth fluctuates based on network congestion, transaction volume, gas limits, and client database engine compaction cycles. Calculations are capacity planning aids, not guaranteed technical performance metrics.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">05.</span>
              <span>Third-Party Clients &amp; External Repositories</span>
            </h2>
            <p>
              NodeDrops documents open-source software clients authored by third parties (e.g., Geth, Nethermind, Besu, Prysm, Lighthouse, Teku, Lodestar, Nitro, Solana-validator).
            </p>
            <p className="text-slate-400">
              NodeDrops does not develop or audit these third-party binaries. Operators must verify checksums and cryptographic signatures against upstream core developer release keys before execution.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">06.</span>
              <span>Disclaimer of Warranties &amp; Limitation of Liability</span>
            </h2>
            <p className="text-slate-400">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NODEDROPS AND ITS MAINTAINERS PROVIDE ALL CONTENT, RUNBOOKS, TOOLS, AND SCRIPTS &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <p className="text-slate-400">
              IN NO EVENT SHALL NODEDROPS, ITS CONTRIBUTORS, OR OPERATORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF CRYPTOGRAPHIC ASSETS, VALIDATOR SLASHING PENALTIES, MISSED ATTESTATION REWARDS, HARDWARE CORRUPTION, OR SERVICE DOWNTIME) ARISING OUT OF THE USE OF OR INABILITY TO USE OUR DOCUMENTATION.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">07.</span>
              <span>Corrections &amp; Contact</span>
            </h2>
            <p>
              If you identify an error, inaccurate configuration, or security vulnerability in any published runbook, please alert us immediately through our <Link href="/contact" className="text-cyan-400 underline">Contact &amp; Errata Desk</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
