import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col bg-[#0a0d14] text-[#f1f5f9]">
        {children}
      </body>
    </html>
  );
}
