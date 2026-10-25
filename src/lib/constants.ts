export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  description?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Networks", href: "/networks", description: "Discover supported Layer 1 and Layer 2 ecosystems" },
  { label: "Testnets", href: "/testnets", badge: "Live", description: "Incentivized and public testnet guides" },
  { label: "Mainnets", href: "/mainnets", description: "Production full and validator node setups" },
  { label: "Guides", href: "/guides", description: "Step-by-step tutorials and configuration runbooks" },
  { label: "Tools", href: "/tools", badge: "New", description: "Hardware estimator, RPC tester, and command generator" },
];

export const FOOTER_LINKS = {
  ecosystem: [
    { label: "Ethereum", href: "/networks/ethereum" },
    { label: "Arbitrum", href: "/networks/arbitrum" },
    { label: "Optimism", href: "/networks/optimism" },
    { label: "Base", href: "/networks/base" },
    { label: "Solana", href: "/networks/solana" },
  ],
  resources: [
    { label: "Node Requirements", href: "/guides/node-requirements" },
    { label: "RPC Endpoints", href: "/tools/rpc" },
    { label: "Security Checklist", href: "/guides/security" },
    { label: "Troubleshooting", href: "/guides/troubleshooting" },
    { label: "Verification Policy", href: "/verification-policy" },
  ],
  platform: [
    { label: "About NodeDrops", href: "/about" },
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Design System", href: "/design-system" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export const SITE_METADATA = {
  name: "NodeDrops",
  domain: "nodedrops.xyz",
  url: "https://nodedrops.xyz",
  tagline: "Web3 Blockchain Node Directory & Educational Platform",
  description:
    "Discover blockchain networks and learn how to deploy, configure, verify, and operate full nodes, validators, and RPC endpoints.",
};
