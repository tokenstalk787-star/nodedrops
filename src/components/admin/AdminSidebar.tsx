"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  BookOpen,
  Layers,
  ExternalLink,
  LogOut,
  Menu,
  X,
  FileCheck2,
  Globe,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { logoutAction } from "@/lib/actions/admin.actions";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Overview", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Networks", href: "/admin/networks", icon: <Server className="w-4 h-4" /> },
    { label: "Runbooks & Guides", href: "/admin/guides", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Categories", href: "/admin/categories", icon: <Layers className="w-4 h-4" /> },
    { label: "Upstream Sources", href: "/admin/sources", icon: <ExternalLink className="w-4 h-4" /> },
    { label: "Review & Submissions", href: "/admin/reviews", icon: <FileCheck2 className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Top Navbar with Menu Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#070b16] border-b border-slate-800 sticky top-0 z-40">
        <Logo size="sm" asLink={false} />
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#070b16] border-r border-slate-800 flex flex-col justify-between transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Header & Logo */}
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <Badge variant="purple" size="sm">CMS</Badge>
          </div>

          {/* User profile capsule */}
          <div className="p-3 rounded-xl bg-[#0b101d] border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="truncate">{user.email}</span>
              <Badge variant="cyan" size="sm">{user.role}</Badge>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5" aria-label="Admin CMS Navigation">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all",
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Platform</span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-500/15 border border-slate-800 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
