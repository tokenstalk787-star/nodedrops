import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Lock, EyeOff, Database, Cookie, Mail, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — NodeDrops",
  description:
    "Transparent privacy policy documenting actual data handling, essential cookies, contact form storage, and zero-tracking commitment.",
  openGraph: {
    title: "Privacy Policy — NodeDrops",
    description:
      "Our privacy practices: no tracking beacons, no advertising cookies, and transparent contact form processing.",
    url: "https://nodedrops.xyz/privacy",
  },
};

export default function PrivacyPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy", href: "/privacy", current: true },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header Hero */}
        <header className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Badge variant="success" size="md">
              <EyeOff className="w-3.5 h-3.5 mr-1" />
              Privacy-First Platform
            </Badge>
            <Badge variant="neutral" size="md">
              Last Updated: October 2026
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            At NodeDrops.xyz, we believe decentralized infrastructure requires decentralized privacy values. This document details our exact data handling practices across our platform.
          </p>
        </header>

        {/* Executive Summary Card */}
        <Card className="border-emerald-500/30 bg-[#061414] p-6 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Core Privacy Commitments</span>
          </div>
          <ul className="text-xs sm:text-sm text-emerald-200/90 space-y-1.5 list-disc list-inside">
            <li><strong>Zero Advertising Trackers:</strong> No Google Analytics, Meta Pixel, or behavioral ad beacons.</li>
            <li><strong>No Tracking Cookies:</strong> Public visitors receive no tracking, profiling, or remarketing cookies.</li>
            <li><strong>Honest Data Storage:</strong> We only store contact inquiries that you explicitly submit.</li>
            <li><strong>Never Monetized:</strong> We do not sell, rent, or trade user contact information under any circumstances.</li>
          </ul>
        </Card>

        {/* Detailed Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>1. Information We Do NOT Collect</span>
            </h2>
            <p>
              NodeDrops does not require user registration or cryptocurrency wallet connection to access guides, networks, or calculators.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li>We never collect private keys, seed phrases, or validator credentials.</li>
              <li>We do not record cryptocurrency wallet balances or personal financial data.</li>
              <li>We do not profile your browsing history across the web.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>2. Information We Collect When You Submit a Form</span>
            </h2>
            <p>
              When you submit a technical errata report, correction, or inquiry through our <Link href="/contact" className="text-cyan-400 underline">Contact Page</Link>, the following information is saved in our private MySQL database:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li><strong>Name or Handle:</strong> To address you in our correspondence.</li>
              <li><strong>Email Address:</strong> To reply with resolution status on your technical report.</li>
              <li><strong>Subject &amp; Message:</strong> The technical errata, URLs, or question you provide.</li>
              <li><strong>Client IP Address:</strong> Recorded solely for denial-of-service prevention and sliding-window rate-limiting (max 5 submissions per window).</li>
              <li><strong>Timestamp:</strong> Date and time when the submission was recorded.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cookie className="w-4 h-4 text-cyan-400" />
              <span>3. Cookie Practices</span>
            </h2>
            <p>
              We distinguish strictly between public visitors and authorized platform maintainers:
            </p>
            <div className="space-y-2 pl-2">
              <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800">
                <span className="font-semibold text-white block">Public Visitors:</span>
                <span className="text-slate-400">Zero tracking cookies. Exploring networks, reading runbooks, and using calculators creates no persistent cookies on your device.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800">
                <span className="font-semibold text-white block">Platform Administrators:</span>
                <span className="text-slate-400">A strictly necessary session cookie named <code className="text-cyan-300 font-mono">nodedrops_admin_session</code> is issued upon successful login to the admin CMS. This cookie is HMAC-SHA256 signed, transmitted exclusively over HTTPS (<code className="text-cyan-300 font-mono">Secure</code>), protected against client-side script inspection (<code className="text-cyan-300 font-mono">HttpOnly</code>), and restricted to same-site navigation (<code className="text-cyan-300 font-mono">SameSite=Lax</code>).</span>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>4. Data Retention &amp; Deletion Rights</span>
            </h2>
            <p>
              Contact form inquiries are retained in our database until marked as resolved by engineering maintainers, or purged during routine database maintenance.
            </p>
            <p>
              You may request the immediate deletion of any contact submission or email associated with your handle by submitting a deletion request through our <Link href="/contact" className="text-cyan-400 underline">Contact Desk</Link>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>5. Third-Party Websites &amp; Outbound Links</span>
            </h2>
            <p>
              Our guides link out to official core developer documentation (e.g. Ethereum Foundation, Arbitrum Offchain Labs, Solana Foundation), GitHub repositories, and public block explorers.
            </p>
            <p>
              Once you navigate away from NodeDrops.xyz to an external site, their independent privacy policies and terms govern your interaction. We encourage you to review their terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
