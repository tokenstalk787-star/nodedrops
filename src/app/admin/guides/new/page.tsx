import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { NewGuideForm } from "./NewGuideForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Runbook — NodeDrops CMS",
  robots: { index: false, follow: false },
};

export default async function NewGuidePage() {
  const session = await requireAdmin();

  const [networks, categories, sources] = await Promise.all([
    prisma.network.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.source.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Guides", href: "/admin/guides" },
    { label: "New Runbook", href: "/admin/guides/new", current: true },
  ];

  return (
    <AdminShell user={session}>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Create Blockchain Node Runbook</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Author a verified setup procedure with dual-shell command blocks, empirical hardware specifications, and expected outputs.
            </p>
          </div>

          <Link href="/admin/guides">
            <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Runbooks
            </Button>
          </Link>
        </div>

        <NewGuideForm
          networks={networks}
          categories={categories}
          sources={sources}
        />
      </div>
    </AdminShell>
  );
}
