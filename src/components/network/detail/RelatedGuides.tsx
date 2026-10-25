import React from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VerificationStatusBadge } from "../VerificationStatus";
import { NetworkDetail } from "./NetworkOverview";

export interface RelatedGuidesProps {
  network: NetworkDetail;
}

export function RelatedGuides({ network }: RelatedGuidesProps) {
  const guides = network.networkGuides.map((ng) => ng.guide);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Deployment Runbooks ({guides.length})</span>
          </CardTitle>
          <Link href="/guides">
            <Button size="sm" variant="ghost" className="text-xs">
              All Runbooks →
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="p-4 rounded-xl bg-[#07090f] border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
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

                  <h4 className="text-sm font-semibold text-white leading-snug">
                    {guide.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {guide.estimatedMinutes} mins
                  </span>
                  <Link href="/guides">
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Read Guide
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 rounded-xl bg-[#07090f]/50 border border-slate-800/50 space-y-2">
            <p className="text-xs sm:text-sm text-slate-400">
              Runbooks for {network.name} are currently in active research and verification.
            </p>
            <Link href="/guides">
              <Button size="sm" variant="secondary">
                Browse Available Runbooks
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
