import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { NewCategoryModal } from "./NewCategoryModal";
import { Badge } from "@/components/ui/Badge";
import { Layers, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Categories — NodeDrops CMS",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const session = await requireAdmin();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          guides: true,
        },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <AdminShell user={session}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            <span>Manage Node Role Categories</span>
            <Badge variant="purple" size="sm">{categories.length}</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Categorize blockchain nodes by operational purpose (Validators, Full Nodes, Archive Nodes, RPC, Sequencers).
          </p>
        </div>

        <NewCategoryModal />
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#070b16] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0b101d] text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Role Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Linked Runbooks</th>
                <th className="py-3 px-4 text-right">Public Archive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    #{cat.displayOrder}
                  </td>

                  <td className="py-3.5 px-4 font-sans font-semibold text-white">
                    <div>{cat.name}</div>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      slug: {cat.slug}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-xs text-slate-300 max-w-md">
                    <p className="line-clamp-2 leading-relaxed">{cat.description}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="cyan" size="sm">
                      {cat._count.guides} runbooks
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right font-sans">
                    <Link
                      href={`/categories/${cat.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
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
