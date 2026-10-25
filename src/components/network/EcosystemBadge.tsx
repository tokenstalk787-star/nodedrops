import React from "react";
import { Badge } from "@/components/ui/Badge";

export interface EcosystemBadgeProps {
  category: string;
  size?: "sm" | "md";
}

export function EcosystemBadge({ category, size = "sm" }: EcosystemBadgeProps) {
  const getVariant = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes("layer 1") || lower.includes("l1")) return "purple" as const;
    if (lower.includes("rollup") || lower.includes("layer 2") || lower.includes("l2")) return "cyan" as const;
    return "neutral" as const;
  };

  return (
    <Badge variant={getVariant(category)} size={size}>
      {category}
    </Badge>
  );
}
