import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { NetworkStatusButton } from "./NetworkStatusButton";
import { NewNetworkModal } from "./NewNetworkModal";
import { Badge } from "@/components/ui/Badge";
import { Server, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Networks — NodeDrops CMS",
  robots: { index: false, follow: false },
};

export default async function AdminNetworksPage() {
  const session = await requireAdmin();

  const networks = await prisma.network.findMany({
    include: {
      _count: {
        select: {
          clients: true,
          hardwareRequirements: true,
          networkGuides: true,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <AdminShell user={session}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <span>Manage Blockchain Networks</span>
            <Badge variant="cyan" size="sm">{networks.length}</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Toggle network status, retire deprecated chains, and inspect attached node roles and client software.
          </p>
        </div>

        <NewNetworkModal />
      </div>

      {/* Networks Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#070b16] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0b101d] text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Layer / Consensus</th>
                <th className="py-3 px-4">Packages</th>
                <th className="py-3 px-4">Runbooks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Public View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {networks.map((net) => (
                <tr key={net.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-semibold text-white">
                    <div className="flex items-center gap-3">
                      {net.logoUrl ? (
                        <img
                          src={net.logoUrl}
                          alt={net.name}
                          width={32}
                          height={32}
                          loading="lazy"
                          decoding="async"
                          className="w-8 h-8 rounded-lg object-contain bg-[#070b16] border border-cyan-500/30 p-1 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                          {net.symbol.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{net.name}</span>
                          <span className="text-cyan-400 text-xs font-mono font-normal">
                            ({net.symbol})
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          slug: {net.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={net.networkType === "MAINNET" ? "info" : "warning"} size="sm">
                      {net.networkType}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                    <div>{net.layer}</div>
                    <span className="text-[11px] text-slate-500 font-mono">{net.consensus}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {net._count.clients} clients
                  </td>

                  <td className="py-3.5 px-4 text-cyan-300">
                    {net._count.networkGuides} guides
                  </td>

                  <td className="py-3.5 px-4">
                    <NetworkStatusButton networkId={net.id} initialStatus={net.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/networks/${net.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-sans"
                    >
                      <span>View</span>
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
