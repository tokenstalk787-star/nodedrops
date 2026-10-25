import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { FEATURED_NETWORKS } from "@/data/mock-homepage";
import { Server, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blockchain Networks Directory — NodeDrops",
  description: "Browse all supported Layer 1, Layer 2, and Rollup blockchain networks with node specifications.",
};

export default async function NetworksPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = resolvedParams?.q?.toLowerCase() || "";

  const filteredNetworks = query
    ? FEATURED_NETWORKS.filter(
        (n) =>
          n.name.toLowerCase().includes(query) ||
          n.ecosystem.toLowerCase().includes(query) ||
          n.primaryClients.some((c) => c.toLowerCase().includes(query))
      )
    : FEATURED_NETWORKS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Breadcrumbs items={[{ label: "Networks", href: "/networks" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Blockchain Networks Directory
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {query
                ? `Showing networks matching "${resolvedParams.q}" (${filteredNetworks.length} found)`
                : "Explore production mainnets and testnets with verified client hardware profiles."}
            </p>
          </div>
          <Badge variant="cyan" size="md" withDot>
            Live Directory
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNetworks.map((net) => (
          <Card key={net.id} hoverable glow="cyan">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge
                  variant={net.type === "Mainnet" ? "info" : "cyan"}
                  size="sm"
                  withDot={net.type === "Mainnet"}
                >
                  {net.type} • {net.category}
                </Badge>
                <span className="text-xs font-mono text-emerald-400">{net.syncStatus}</span>
              </div>
              <CardTitle className="mt-3">{net.name}</CardTitle>
              <CardDescription>Ecosystem: {net.ecosystem}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300 font-mono">
              <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
                <div><span className="text-slate-500">CPU:</span> {net.minHardware.cpu}</div>
                <div><span className="text-slate-500">RAM:</span> {net.minHardware.ram}</div>
                <div><span className="text-slate-500">Disk:</span> {net.minHardware.storage}</div>
              </div>
              <div className="text-slate-400 font-sans">
                <span className="font-semibold text-slate-300">Clients: </span>
                {net.primaryClients.join(", ")}
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-slate-400 font-sans">{net.guidesCount} verified guides</span>
              <Link href="/guides">
                <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Runbook
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredNetworks.length === 0 && (
        <div className="text-center py-16 space-y-4 rounded-2xl bg-[#0b101d] border border-dashed border-slate-800">
          <Server className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-semibold text-white">No networks found</h3>
          <p className="text-sm text-slate-400">Try searching for &quot;Ethereum&quot;, &quot;Arbitrum&quot;, or &quot;Solana&quot;.</p>
          <Link href="/networks">
            <Button variant="secondary" size="sm">Reset Filter</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
