import React from "react";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ToolsHub, ToolTab } from "@/components/tools/ToolsHub";
import { Wrench } from "lucide-react";

interface ToolsPageProps {
  searchParams?: Promise<{
    tab?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Node Operator Sizing & Planning Tools — NodeDrops",
  description:
    "Interactive capacity planning tools for blockchain node runners: hardware readiness checklist, storage expansion estimator, bandwidth planning calculator, and node operating cost estimator.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Node Operator Tools — NodeDrops",
    description:
      "Interactive capacity planning tools for blockchain node runners: hardware readiness checklist, storage expansion estimator, bandwidth planning calculator, and node operating cost estimator.",
    url: "https://nodedrops.xyz/tools",
  },
};

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const resolved = searchParams ? await searchParams : {};
  const rawTab = resolved.tab?.toLowerCase() as ToolTab | undefined;
  const initialTab =
    rawTab && ["hardware", "storage", "bandwidth", "cost", "deployment"].includes(rawTab)
      ? rawTab
      : "hardware";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools", current: true },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Page Header */}
        <header className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="md">
              <Wrench className="w-3.5 h-3.5 mr-1" />
              Node Engineering Utilities
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              Capacity Planning &amp; Cost Estimation
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Node Operator Tools
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Deterministic calculators and pre-flight checklists to size physical hardware, model state growth, budget electricity and cloud expenses, and verify deployment security.
          </p>
        </header>

        {/* Tools Interactive Hub */}
        <ToolsHub initialTab={initialTab} />
      </div>
    </div>
  );
}
