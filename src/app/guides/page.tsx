import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { LATEST_GUIDES } from "@/data/mock-homepage";
import { BookOpen, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Node Runbooks & Deployment Guides — NodeDrops",
  description: "Verified step-by-step guides for installing, syncing, securing, and maintaining blockchain nodes.",
};

export default function GuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Breadcrumbs items={[{ label: "Guides", href: "/guides" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Node Deployment Runbooks</span>
              <Badge variant="cyan" size="sm" withDot>Verified</Badge>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Step-by-step installation, Docker compose templates, configuration flags, and post-sync health checks.
            </p>
          </div>
          <Link href="/tools">
            <Button variant="secondary" size="sm" leftIcon={<BookOpen className="w-3.5 h-3.5" />}>
              Hardware Sizing Calculator
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LATEST_GUIDES.map((guide) => (
          <Card key={guide.id} hoverable glow="cyan">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge
                  variant={
                    guide.difficulty === "Beginner"
                      ? "success"
                      : guide.difficulty === "Intermediate"
                      ? "info"
                      : "purple"
                  }
                  size="sm"
                >
                  {guide.difficulty}
                </Badge>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {guide.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {guide.lastVerified}
                  </span>
                </div>
              </div>
              <CardTitle className="mt-3 text-lg">{guide.title}</CardTitle>
              <CardDescription>
                Target Network: <span className="text-cyan-400 font-semibold">{guide.network}</span> • Type: {guide.nodeType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {guide.summary}
              </p>
            </CardContent>
            <CardFooter>
              <span className="text-xs font-mono text-slate-500">Slug: /{guide.slug}</span>
              <Link href="/networks">
                <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Read Runbook
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
