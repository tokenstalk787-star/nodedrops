import React from "react";
import { NetworkType } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";

export interface NetworkTypeBadgeProps {
  type: NetworkType;
  size?: "sm" | "md";
}

export function NetworkTypeBadge({ type, size = "sm" }: NetworkTypeBadgeProps) {
  if (type === NetworkType.MAINNET) {
    return (
      <Badge variant="info" size={size} withDot>
        Mainnet
      </Badge>
    );
  }

  return (
    <Badge variant="cyan" size={size} withDot withPing>
      Testnet
    </Badge>
  );
}
