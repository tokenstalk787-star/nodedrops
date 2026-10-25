import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { GuidePublicationButton } from "./GuidePublicationButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookOpen, Plus, ExternalLink } from "lucide-react";
import { VerificationStatusBadge } from "@/components/network/VerificationStatus";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Runbooks & Guides — NodeDrops CMS",
  robots: { index: false, follow: false },
};

export default async function AdminGuidesPage() {
  const session = await requireAdmin();

  const guides = await prisma.guide.findMany({
    include: {
      category: true,
      guideNetworks: {
        include: {
          network: true,
        },
      },
      guideSources: {
        include: {
          source: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell user={session}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Manage Deployment Runbooks</span>
            <Badge variant="cyan" size="sm">{guides.length}</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Author and inspect node runbooks, manage draft publication lifecycle, and preview internal research.
          </p>
        </div>

        <Link href="/admin/guides/new">
          <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Runbook
          </Button>
        </Link>
      </div>

      {/* Guides Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#070b16] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0b101d] text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Runbook Title</th>
                <th className="py-3 px-4">Target Network</th>
                <th className="py-3 px-4">Role Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Publication Status</th>
                <th className="py-3 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-semibold text-white max-w-xs">
                    <div className="truncate">{guide.title}</div>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      slug: {guide.slug}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                    {guide.guideNetworks[0]?.network?.name || "General Network"}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="neutral" size="sm">
                      {guide.category?.name || "Uncategorized"}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        guide.difficulty === "BEGINNER"
                          ? "success"
                          : guide.difficulty === "INTERMEDIATE"
                          ? "info"
                          : "purple"
                      }
                      size="sm"
                    >
                      {guide.difficulty}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4">
                    <VerificationStatusBadge
                      status={guide.verificationStatus}
                      verifiedDate={guide.verifiedAt}
                      size="sm"
                    />
                  </td>

                  <td className="py-3.5 px-4">
                    <GuidePublicationButton guideId={guide.id} initialStatus={guide.publicationStatus} />
                  </td>

                  <td className="py-3.5 px-4 text-right font-sans">
                    <Link
                      href={`/guides/${guide.slug}?preview=true`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
