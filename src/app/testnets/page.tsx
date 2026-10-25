import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { FEATURED_NETWORKS } from "@/data/mock-homepage";
import { ArrowRight, Flame } from "lucide-react";

export const metadata = {
  title: "Testnets Directory — NodeDrops",
  description: "Discover active public testnets, faucet resources, and risk-free validator testing environments.",
};

export default function TestnetsPage() {
  const testnets = FEATURED_NETWORKS.filter((n) => n.type === "Testnet");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Breadcrumbs items={[{ label: "Testnets", href: "/testnets" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Public Testnets Directory</span>
              <Badge variant="cyan" size="sm" withDot withPing>Live</Badge>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Test validator configurations, client upgrades, and node operations with testnet assets before deploying to mainnet.
            </p>
          </div>
          <Link href="/guides">
            <Button variant="secondary" size="sm" leftIcon={<Flame className="w-3.5 h-3.5 text-amber-400" />}>
              Testnet Validator Runbooks
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testnets.map((net) => (
          <Card key={net.id} hoverable glow="cyan">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="cyan" size="sm" withDot>
                  {net.ecosystem} Testnet
                </Badge>
                <span className="text-xs font-mono text-cyan-400">{net.syncStatus}</span>
              </div>
              <CardTitle className="mt-3">{net.name}</CardTitle>
              <CardDescription>Category: {net.category}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300 font-mono">
              <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800 space-y-1">
                <div><span className="text-slate-500">Storage:</span> {net.minHardware.storage}</div>
                <div><span className="text-slate-500">RAM:</span> {net.minHardware.ram}</div>
                <div><span className="text-slate-500">CPU:</span> {net.minHardware.cpu}</div>
              </div>
              <div className="text-slate-400 font-sans">
                <span className="font-semibold text-slate-300">Supported Clients: </span>
                {net.primaryClients.join(", ")}
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-slate-400 font-sans">{net.guidesCount} setup guides</span>
              <Link href="/guides">
                <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Start Node
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
