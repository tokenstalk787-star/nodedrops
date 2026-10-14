
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nodedrops.xyz"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NodeDrops.xyz — Web3 Testnets & Node Opportunities",
    template: "%s | NodeDrops.xyz",
  },
  description:
    "Discover blockchain testnets, incentivized node programs, and Web3 developer opportunities. Check official sources, project status, costs, and reward announcements.",
  applicationName: "NodeDrops.xyz",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "NodeDrops.xyz",
    title: "NodeDrops.xyz — Discover Web3 Opportunities",
    description:
      "Explore blockchain testnets, node programs, and developer opportunities with transparent verification information.",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NodeDrops.xyz — Web3 Testnets and Node Opportunities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NodeDrops.xyz — Discover Web3 Opportunities",
    description:
      "Explore blockchain testnets, node programs, and Web3 developer opportunities.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
