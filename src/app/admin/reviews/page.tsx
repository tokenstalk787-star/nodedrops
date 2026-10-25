import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { VerifyGuideButton } from "./VerifyGuideButton";
import { SubmissionStatusButton } from "./SubmissionStatusButton";
import { VerificationStatusBadge } from "@/components/network/VerificationStatus";
import { FileCheck2, Clock, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review & Quality Queue — NodeDrops CMS",
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  const session = await requireAdmin();

  const [guides, submissions] = await Promise.all([
    prisma.guide.findMany({
      include: {
        category: true,
        guideNetworks: { include: { network: true } },
      },
      orderBy: [{ verifiedAt: "asc" }, { createdAt: "desc" }],
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const now = new Date();

  return (
    <AdminShell user={session}>
      {/* Top Banner */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-cyan-400" />
          <span>Content Quality &amp; Verification Queue</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor guide verification freshness, perform factual verification audits, and process incoming contact inquiries.
        </p>
      </div>

      {/* 1. Runbooks Review Freshness Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Runbook Verification Status ({guides.length})</span>
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070b16] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0b101d] text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Runbook</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Current Verification</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {guides.map((guide) => {
                  let isOverdue = false;
                  let daysAgo = "Never";
                  if (guide.verifiedAt) {
                    const diffDays = Math.floor(
                      (now.getTime() - new Date(guide.verifiedAt).getTime()) / (1000 * 3600 * 24)
                    );
                    daysAgo = `${diffDays} days ago`;
                    if (diffDays > 90) isOverdue = true;
                  } else {
                    isOverdue = true;
                  }

                  return (
                    <tr key={guide.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-semibold text-white max-w-xs">
                        <Link
                          href={`/guides/${guide.slug}?preview=true`}
                          target="_blank"
                          className="hover:text-cyan-300 transition-colors"
                        >
                          {guide.title}
                        </Link>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          slug: {guide.slug}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                        {guide.guideNetworks[0]?.network?.name || "General"}
                      </td>

                      <td className="py-3.5 px-4">
                        <VerificationStatusBadge
                          status={guide.verificationStatus}
                          verifiedDate={guide.verifiedAt}
                          size="sm"
                        />
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono">
                        <span className={isOverdue ? "text-amber-400 font-semibold" : "text-slate-300"}>
                          {daysAgo}
                        </span>
                        {isOverdue && (
                          <span className="ml-1 text-[10px] text-amber-500 font-sans block">
                            Needs Review
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <VerifyGuideButton guideId={guide.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Contact Submissions Table */}
      <section className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>User Inquiries &amp; Technical Submissions ({submissions.length})</span>
          </h2>
        </div>

        {submissions.length > 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#070b16] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#0b101d] text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Sender</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-sans text-white">
                        <div className="font-semibold">{sub.name}</div>
                        <span className="text-[11px] text-slate-400 font-mono">{sub.email}</span>
                      </td>

                      <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                        {sub.subject}
                      </td>

                      <td className="py-3.5 px-4 font-sans text-xs text-slate-300 max-w-sm">
                        <p className="line-clamp-2 leading-relaxed">{sub.message}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <SubmissionStatusButton
                          submissionId={sub.id}
                          initialStatus={sub.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-[#070b16] text-xs text-slate-400">
            No contact submissions received yet.
          </div>
        )}
      </section>
    </AdminShell>
  );
}
