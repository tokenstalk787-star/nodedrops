import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "./ContactForm";
import {
  Mail,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Content Corrections — NodeDrops",
  description:
    "Submit technical errata, report outdated blockchain client configurations, request source verification, or contact the NodeDrops infrastructure team.",
  openGraph: {
    title: "Contact & Content Corrections — NodeDrops",
    description:
      "Submit technical errata, report outdated blockchain client configurations, or contact the NodeDrops infrastructure team.",
    url: "https://nodedrops.xyz/contact",
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact", current: true },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header Hero */}
        <header className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="md">
              <Mail className="w-3.5 h-3.5 mr-1" />
              Community &amp; Errata Desk
            </Badge>
            <Badge variant="neutral" size="md">
              SLA: 24–48 Hours
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Contact NodeDrops Engineering
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Report technical discrepancies, submit runbook corrections, request upstream source verification, or ask questions regarding node deployment standards.
          </p>
        </header>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Column */}
          <div className="lg:col-span-7">
            <Card className="border-slate-800/80 bg-[#070b16]/90 backdrop-blur-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span>Submit an Inquiry or Errata</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                All submissions are stored in our verified administrative queue and reviewed by technical maintainers.
              </p>

              <ContactForm />
            </Card>
          </div>

          {/* Guidelines & Direct Channels Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Errata Triage Card */}
            <Card className="border-slate-800/80 bg-[#070b16]/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <FileCheck2 className="w-4 h-4" />
                <span>Technical Errata &amp; Corrections</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an upstream client release (e.g. Geth, Prysm, Reth, Solana-validator) alters CLI flags, systemd unit templates, or RPC port conventions, please provide:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Specific runbook URL or network slug</li>
                <li>Affected client software &amp; release version</li>
                <li>Link to official core developer release notes or PR</li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/methodology"
                  className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold transition-colors"
                >
                  Review our Verification Methodology &rarr;
                </Link>
              </div>
            </Card>

            {/* Security Disclosure Notice */}
            <Card className="border-slate-800/80 bg-[#070b16]/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Operational Security Policy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                NodeDrops maintainers will <strong>never</strong> ask for private keys, validator seed phrases, keystore password files, or SSH remote access credentials.
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Do not include sensitive host configurations or unredacted API tokens in form submissions.
              </p>
            </Card>

            {/* Educational Non-Commercial Notice */}
            <Card className="border-slate-800/80 bg-[#070b16]/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Vendor Neutrality</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                NodeDrops operates as an independent, non-commercial educational resource. We decline sponsored listings, paid guide placements, or undisclosed promotional partnerships.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
