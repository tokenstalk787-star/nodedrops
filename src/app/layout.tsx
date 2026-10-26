import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebSiteSchema } from "@/lib/seo/schema";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nodedrops.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "NodeDrops — Your Guide to Running Blockchain Nodes",
    template: "%s | NodeDrops",
  },
  description:
    "Discover blockchain networks and learn how to deploy, configure, operate, verify, and troubleshoot full nodes, validators, and RPC endpoints.",
  keywords: [
    "blockchain nodes",
    "validator setup",
    "ethereum validator holesky",
    "arbitrum nitro node",
    "base rpc node",
    "solana validator",
    "web3 infrastructure runbooks",
    "node hardware requirements",
  ],
  authors: [{ name: "NodeDrops Engineering Team", url: baseUrl }],
  creator: "NodeDrops",
  publisher: "NodeDrops",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "NodeDrops",
    title: "NodeDrops — Your Guide to Running Blockchain Nodes",
    description:
      "Discover blockchain networks and learn how to deploy, configure, operate, verify, and troubleshoot full nodes, validators, and RPC endpoints.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NodeDrops — Your Guide to Running Blockchain Nodes",
    description:
      "Discover blockchain networks and learn how to deploy, configure, operate, verify, and troubleshoot full nodes, validators, and RPC endpoints.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "google-adsense-account": "ca-pub-1425431915803453",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect & DNS-Prefetch for low-latency ad assets */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0a0d14] text-[#f1f5f9] antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        {/* Accessibility: Skip to Content Anchor */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
        >
          Skip to content
        </a>

        {/* Global Structured Data */}
        <JsonLd data={buildWebSiteSchema()} />

        {/* Privacy-Preserving GA4 */}
        <GoogleAnalytics />

        {/* Google AdSense Script - lazyOnload eliminates CPU blocking during FCP/LCP for 95+ Mobile Lighthouse */}
        <Script
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1425431915803453"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        <SiteHeader />

        <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
