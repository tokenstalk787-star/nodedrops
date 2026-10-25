"use client";

import React, { useTransition } from "react";
import { VerificationStatus } from "@prisma/client";
import { markGuideVerifiedAction } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

interface VerifyGuideButtonProps {
  guideId: string;
}

export function VerifyGuideButton({ guideId }: VerifyGuideButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleVerify = (status: VerificationStatus) => {
    startTransition(async () => {
      await markGuideVerifiedAction(guideId, status);
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
        onClick={() => handleVerify(VerificationStatus.OFFICIAL_DOCS_VERIFIED)}
      >
        {isPending ? "Updating..." : "Verify Docs"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        onClick={() => handleVerify(VerificationStatus.SETUP_TESTED)}
      >
        Tested
      </Button>
    </div>
  );
}
