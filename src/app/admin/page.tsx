import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Server,
  BookOpen,
  Layers,
  FileCheck2,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldAlert,
  Clock,
  Activity,
  UserCheck,
} from "lucide-react";
import { NetworkStatus, PublicationStatus, VerificationStatus, SubmissionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard — NodeDrops CMS",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  // Parallel database metrics
  const [
    totalNetworks,
    activeNetworks,
    totalGuides,
    publishedGuides,
    draftGuides,
    totalCategories,
    totalSources,
    pendingSubmissions,
    overdueReviewsCount,
    recentAuditLogs,
    draftsList,
  ] = await Promise.all([
    prisma.network.count(),
    prisma.network.count({ where: { status: NetworkStatus.ACTIVE } }),
    prisma.guide.count(),
    prisma.guide.count({ where: { publicationStatus: PublicationStatus.PUBLISHED } }),
    prisma.guide.count({ where: { publicationStatus: PublicationStatus.DRAFT } }),
    prisma.category.count(),
    prisma.source.count(),
    prisma.contactSubmission.count({ where: { status: SubmissionStatus.PENDING } }),
    prisma.guide.count({
      where: {
        OR: [
          { verificationStatus: VerificationStatus.UNDER_REVIEW },
          { verifiedAt: null },
        ],
      },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.guide.findMany({
      where: { publicationStatus: PublicationStatus.DRAFT },
      include: {
        category: true,
        guideNetworks: { include: { network: true } },
      },
      take: 5,
    }),
  ]);

  return (
    <AdminShell user={session}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Infrastructure Operations CMS
            </h1>
            <Badge variant="cyan" size="sm">Admin</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time MySQL database metrics, publication status control, and verification audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/guides/new">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create Runbook
            </Button>
          </Link>
          <Link href="/admin/reviews">
            <Button size="sm" variant="outline" leftIcon={<FileCheck2 className="w-4 h-4" />}>
              Review Queue ({overdueReviewsCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Networks Metric */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Networks</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalNetworks}</div>
          <div className="text-[11px] text-emerald-400 font-mono">
            {activeNetworks} Active in Directory
          </div>
        </div>

        {/* Guides Metric */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Runbooks &amp; Guides</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalGuides}</div>
          <div className="text-[11px] text-cyan-400 font-mono">
            {publishedGuides} Published • {draftGuides} Drafts
          </div>
        </div>

        {/* Categories Metric */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Node Roles</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalCategories}</div>
          <div className="text-[11px] text-slate-400 font-mono">
            Across {totalSources} Verified Sources
          </div>
        </div>

        {/* Submissions & Reviews Metric */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Pending Attention</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono">
            {pendingSubmissions + overdueReviewsCount}
          </div>
          <div className="text-[11px] text-amber-400/90 font-mono">
            {pendingSubmissions} Inquiries • {overdueReviewsCount} Reviews
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Drafts Awaiting Publication & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Draft Runbooks awaiting publication */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Draft Runbooks Awaiting Publication ({draftsList.length})</span>
            </h2>
            <Link href="/admin/guides">
              <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                All Guides
              </Button>
            </Link>
          </div>

          {draftsList.length > 0 ? (
            <div className="space-y-3">
              {draftsList.map((draft) => (
                <div
                  key={draft.id}
                  className="p-4 rounded-xl border border-slate-800 bg-[#070b16] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{draft.title}</span>
                      <Badge variant="warning" size="sm">DRAFT</Badge>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{draft.summary}</p>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Category: {draft.category?.name || "General"} • Network: {draft.guideNetworks[0]?.network?.name || "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/guides/${draft.slug}?preview=true`} target="_blank">
                      <Button size="sm" variant="outline" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl border border-slate-800 bg-[#070b16] text-xs text-slate-400">
              No unpublished drafts currently pending. All active runbooks are published.
            </div>
          )}
        </div>

        {/* Right: Security & Action Audit Logs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Administrative Audit Trail</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {recentAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-800/80 bg-[#070b16] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-300">{log.action}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <UserCheck className="w-3 h-3 text-slate-500" />
                  <span>{log.user?.name || "System"}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-mono">{log.entityType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
