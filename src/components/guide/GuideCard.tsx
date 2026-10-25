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

        <CardTitle className="mt-3 text-lg group-hover:text-cyan-300 transition-colors">
          <Link href={`/guides/${guide.slug}`} className="hover:underline">
            {guide.title}
          </Link>
        </CardTitle>

        <CardDescription className="flex items-center gap-1.5 text-xs text-cyan-400">
          <Server className="w-3 h-3" />
          <span>{primaryNetwork?.name || "General Network"}</span>
          {guide.category && <span className="text-slate-500">• {guide.category.name}</span>}
        </CardDescription>
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
