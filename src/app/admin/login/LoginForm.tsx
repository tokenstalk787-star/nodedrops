"use client";

import React, { useActionState } from "react";
import { loginAdminAction } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Lock, Mail, ArrowRight } from "lucide-react";

interface LoginFormProps {
  returnUrl?: string;
}

export function LoginForm({ returnUrl = "/admin" }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {/* Return URL hidden input */}
      <input type="hidden" name="returnUrl" value={returnUrl} />

      {/* Error alert */}
      {state?.error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{state.error}</span>
        </div>
      )}

      {/* Email input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
          <Mail className="w-3.5 h-3.5 text-cyan-400" />
          <span>Admin Email</span>
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="admin@nodedrops.xyz"
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:border-cyan-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Password input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Password</span>
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••••••"
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:border-cyan-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isPending}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full justify-center"
        >
          {isPending ? "Authenticating..." : "Sign In to Admin Panel"}
        </Button>
      </div>
    </form>
  );
}
