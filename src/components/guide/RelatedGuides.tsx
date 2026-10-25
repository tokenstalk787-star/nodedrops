import React from "react";
import { GuideWithRelations } from "@/lib/repositories/guide.repository";
import { GuideCard } from "./GuideCard";
import { BookOpen } from "lucide-react";

export interface RelatedGuidesProps {
  guides: GuideWithRelations[];
  currentGuideId?: string;
  title?: string;
}

export function RelatedGuides({
  guides,
  currentGuideId,
  title = "Related Guides & Runbooks",
}: RelatedGuidesProps) {
  const filtered = currentGuideId
    ? guides.filter((g) => g.id !== currentGuideId)
    : guides;

  if (filtered.length === 0) return null;

  return (
    <section className="my-12 pt-8 border-t border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-cyan-400" />
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, 3).map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </section>
  );
}
