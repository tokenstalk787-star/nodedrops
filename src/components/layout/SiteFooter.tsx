"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_LINKS, SITE_METADATA } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { ShieldAlert } from "lucide-react";

export function SiteFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide public footer inside administrative CMS routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800/80 bg-[#07090f] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Platform Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {SITE_METADATA.description}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="success" size="sm" withDot withPing>
                All Node Networks Operational
              </Badge>
            </div>
          </div>

          {/* Ecosystem Column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Ecosystems
            </h4>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS.ecosystem.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-cyan-400 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Node Resources
            </h4>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-cyan-400 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform & Policy
            </h4>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-cyan-400 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security & Disclaimer Notice */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-amber-400/80">
            <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              Security notice: NodeDrops is an independent educational platform. Never enter private keys or seed phrases into any node script.
            </span>
          </div>
          <div>
            © {currentYear} {SITE_METADATA.domain}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
