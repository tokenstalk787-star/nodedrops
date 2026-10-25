import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Terminal, Cpu, Network, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Node Operator Tools — NodeDrops",
  description: "Hardware requirements calculator, RPC latency tester, and docker-compose generator for blockchain node runners.",
};

export default function ToolsPage() {
  const tools = [
    {
      title: "Hardware Sizing Calculator",
      badge: "Sizing",
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      description: "Estimate minimum and recommended CPU, RAM, and NVMe disk growth across pruned vs archive nodes.",
      actionText: "Open Calculator",
      href: "/guides",
    },
    {
      title: "Public RPC Latency Tester",
      badge: "Diagnostic",
      icon: <Network className="w-5 h-5 text-blue-400" />,
      description: "Send live eth_blockNumber JSON-RPC requests to verify endpoint responsiveness and sync state.",
      actionText: "Probe Endpoints",
      href: "/networks",
    },
    {
      title: "Docker Compose Generator",
      badge: "Automation",
      icon: <Terminal className="w-5 h-5 text-violet-400" />,
      description: "Select client pairs (e.g. Geth + Lighthouse) and generate production systemd or Docker configs.",
      actionText: "Generate Config",
      href: "/guides",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Node Operator Tools</span>
              <Badge variant="cyan" size="sm" withDot>Phase 06 Roadmap</Badge>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Interactive utilities designed for node operators, DevOps engineers, and validator teams.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.title} hoverable glow="cyan">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-[#07090f] border border-slate-800 inline-flex">
                  {tool.icon}
                </span>
                <Badge variant="neutral" size="sm">
                  {tool.badge}
                </Badge>
              </div>
              <CardTitle className="mt-3">{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">
                Interactive tool implementation scheduled for Phase 06 with client-side probe execution.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={tool.href} className="w-full">
                <Button size="sm" variant="secondary" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  {tool.actionText}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
