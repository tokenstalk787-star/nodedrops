import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "NodeDrops — Your Guide to Running Blockchain Nodes",
  description:
    "Discover blockchain networks and learn how to deploy, configure, operate, verify, and troubleshoot nodes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#0a0d14] text-[#f1f5f9] antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        <SiteHeader />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
