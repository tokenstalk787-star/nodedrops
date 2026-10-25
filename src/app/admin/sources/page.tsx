import React from "react";
import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { NewSourceModal } from "./NewSourceModal";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upstream Sources — NodeDrops CMS",
  robots: { index: false, follow: false },
};

export default async function AdminSourcesPage() {
  const session = await requireAdmin();

  const sources = await prisma.source.findMany({
    include: {
      _count: {
        select: {
          guideSources: true,
          networkSources: true,
        },
      },
    },
    orderBy: [{ reliabilityScore: "desc" }, { name: "asc" }],
  });

  return (
    <AdminShell user={session}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-cyan-400" />
            <span>Manage Upstream Documentation Sources</span>
            <Badge variant="cyan" size="sm">{sources.length}</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Authoritative source documentation, official client GitHub repositories, and network client specifications.
          </p>
        </div>

        <NewSourceModal />
      </div>

      {/* Sources Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#070b16] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0b101d] text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Source Title</th>
                <th className="py-3 px-4">Source Classification</th>
                <th className="py-3 px-4">Reliability Rating</th>
                <th className="py-3 px-4">Attached Runbooks</th>
                <th className="py-3 px-4 text-right">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-semibold text-white max-w-sm">
                    <div>{source.name}</div>
                    <span className="text-[11px] text-slate-500 font-mono truncate block max-w-xs">
                      {source.url}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="neutral" size="sm">
                      {source.sourceType}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-bold">
                      {source.reliabilityScore}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {source._count.guideSources} guides
                  </td>

                  <td className="py-3.5 px-4 text-right font-sans">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
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
