import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Server } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VerificationStatusBadge } from "../network/VerificationStatus";
import { GuideWithRelations } from "@/lib/repositories/guide.repository";

export interface GuideCardProps {
  guide: GuideWithRelations;
}

export function GuideCard({ guide }: GuideCardProps) {
  const primaryNetwork = guide.guideNetworks[0]?.network;

  return (
    <Card hoverable glow="cyan" className="flex flex-col justify-between h-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
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

          <VerificationStatusBadge
            status={guide.verificationStatus}
            verifiedDate={guide.verifiedAt}
            size="sm"
          />
        </div>

        <div className="flex items-center gap-3 mt-3">
          {guide.logoUrl || primaryNetwork?.logoUrl ? (
            <div className="w-10 h-10 rounded-xl bg-[#070b16] border border-cyan-500/30 p-1.5 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:border-cyan-400/60 group-hover:shadow-[0_0_16px_rgba(6,182,212,0.25)] transition-all">
              <img
                src={guide.logoUrl || primaryNetwork?.logoUrl || ""}
                alt={`${primaryNetwork?.name || "Runbook"} official logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-800/40 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
              <Server className="w-5 h-5 text-cyan-400" />
            </div>
          )}

          <div className="min-w-0">
            <CardTitle className="text-lg group-hover:text-cyan-300 transition-colors leading-snug line-clamp-1">
              <Link href={`/guides/${guide.slug}`} className="hover:underline">
                {guide.title}
              </Link>
            </CardTitle>

            <CardDescription className="flex items-center gap-1.5 text-xs text-cyan-400 truncate">
              <span>{primaryNetwork?.name || "General Network"}</span>
              {guide.category && <span className="text-slate-500">• {guide.category.name}</span>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
          {guide.summary}
        </p>
      </CardContent>

      <CardFooter>
        <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{guide.estimatedMinutes} mins</span>
        </span>

        <Link href={`/guides/${guide.slug}`}>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Open Runbook
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
