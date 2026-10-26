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
    { label: "Arbitrum One", href: "/networks/arbitrum-one" },
    { label: "Base", href: "/networks/base" },
    { label: "Solana", href: "/networks/solana" },
    { label: "Holesky Testnet", href: "/networks/holesky" },
  ],
  resources: [
    { label: "Hardware Checklist", href: "/tools?tab=hardware" },
    { label: "Storage Calculator", href: "/tools?tab=storage" },
    { label: "Bandwidth Planner", href: "/tools?tab=bandwidth" },
    { label: "Cost Estimator", href: "/tools?tab=cost" },
    { label: "Deployment Checklist", href: "/tools?tab=deployment" },
  ],
  platform: [
    { label: "About NodeDrops", href: "/about" },
    { label: "Content Methodology", href: "/methodology" },
    { label: "Contact & Errata", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
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
