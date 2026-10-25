import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/ui/Logo";
import { ShieldCheck, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin CMS Login — NodeDrops",
  description: "Secure administrative access portal for NodeDrops infrastructure engineers.",
  robots: {
    index: false,
    follow: false,
  },
};

interface LoginPageProps {
  searchParams?: Promise<{
    returnUrl?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  const resolved = searchParams ? await searchParams : {};
  const returnUrl = resolved.returnUrl || "/admin";

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Administrative CMS Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sign In to Manage NodeDrops
          </h1>
          <p className="text-xs text-slate-400">
            Authentication is restricted to verified administrators and content editors.
          </p>
        </div>

        {/* Login Card Form */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#070b16] shadow-2xl backdrop-blur-xl">
          <LoginForm returnUrl={returnUrl} />
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          <span>Rate limited &amp; tamper-resistant audit logging enabled</span>
        </div>
      </div>
    </div>
  );
}
