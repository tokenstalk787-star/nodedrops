import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { SessionUser } from "@/lib/auth/session";

interface AdminShellProps {
  user: SessionUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <AdminSidebar user={user} />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 min-w-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
