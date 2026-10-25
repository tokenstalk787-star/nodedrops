/**
 * Temporary typed dataset for NodeDrops Homepage (Phase 03).
 *
 * NOTE: This data will be replaced by Prisma ORM database queries
 * against MySQL tables (Network, NodeType, Guide, HardwareRequirement)
 * in Phase 04–06.
 */

export interface Ecosystem {
  id: string;
  name: string;
  slug: string;
  symbol: string;
  layer: string;
  consensus: string;
  nodeCountEstimate: string;
  color: "cyan" | "blue" | "violet" | "info" | "neutral" | "success" | "warning" | "purple";
  featured: boolean;
}

export interface FeaturedNetwork {
  id: string;
  name: string;
  slug: string;
  type: "Mainnet" | "Testnet";
  ecosystem: string;
  category: "Layer 1" | "Layer 2" | "Rollup";
  primaryClients: string[];
  minHardware: {
    cpu: string;
    ram: string;
    storage: string;
  };
  syncStatus: "Stable" | "Fast Sync Ready" | "Active";
  guidesCount: number;
}

export interface LatestGuide {
  id: string;
  title: string;
  slug: string;
  network: string;
  networkSlug: string;
  nodeType: "Full Node" | "Validator Node" | "Archive Node" | "RPC Node";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  lastVerified: string;
  summary: string;
}

export interface NodeTypeCategory {
  id: string;
  title: string;
  slug: string;
  badge: string;
  description: string;
  role: string;
  hardwareTier: "Low" | "Medium" | "High" | "Enterprise";
  storageType: string;
}

export interface VerificationPillar {
  title: string;
  description: string;
  iconName: string;
}

// -------------------------------------------------------------
// Datasets
// -------------------------------------------------------------

export const ECOSYSTEMS_DATA: Ecosystem[] = [
  {
    id: "eco-eth",
    name: "Ethereum",
    slug: "ethereum",
    symbol: "ETH",
    layer: "Layer 1",
    consensus: "Proof-of-Stake",
    nodeCountEstimate: "9,000+ Active Nodes",
    color: "cyan",
    featured: true,
  },
  {
    id: "eco-arb",
    name: "Arbitrum",
    slug: "arbitrum",
    symbol: "ARB",
    layer: "Layer 2 Rollup",
    consensus: "Nitro Multi-Round Fault Proof",
    nodeCountEstimate: "Nitro Stack",
    color: "blue",
    featured: true,
  },
  {
    id: "eco-op",
    name: "Optimism",
    slug: "optimism",
    symbol: "OP",
    layer: "Layer 2 OP Stack",
    consensus: "Bedrock Fault Proofs",
    nodeCountEstimate: "Superchain Ready",
    color: "warning",
    featured: true,
  },
  {
    id: "eco-base",
    name: "Base",
    slug: "base",
    symbol: "ETH",
    layer: "Layer 2 OP Stack",
    consensus: "Optimistic Sequencing",
    nodeCountEstimate: "Coinbase L2",
    color: "info",
    featured: true,
  },
  {
    id: "eco-sol",
    name: "Solana",
    slug: "solana",
    symbol: "SOL",
    layer: "Layer 1",
    consensus: "Proof-of-History + PoS",
    nodeCountEstimate: "1,500+ Validators",
    color: "violet",
    featured: true,
  },
  {
    id: "eco-poly",
    name: "Polygon",
    slug: "polygon",
    symbol: "POL",
    layer: "Proof-of-Stake / zkEVM",
    consensus: "Bor + Heimdall Architecture",
    nodeCountEstimate: "AggLayer Compatible",
    color: "purple",
    featured: false,
  },
];

export const FEATURED_NETWORKS: FeaturedNetwork[] = [
  {
    id: "net-eth-mainnet",
    name: "Ethereum Mainnet",
    slug: "ethereum",
    type: "Mainnet",
    ecosystem: "Ethereum",
    category: "Layer 1",
    primaryClients: ["Geth", "Nethermind", "Lighthouse", "Prysm"],
    minHardware: {
      cpu: "4 Cores (8 Threads)",
      ram: "16 GB DDR4",
      storage: "2 TB NVMe SSD",
    },
    syncStatus: "Stable",
    guidesCount: 4,
  },
  {
    id: "net-eth-holesky",
    name: "Ethereum Holesky",
    slug: "holesky",
    type: "Testnet",
    ecosystem: "Ethereum",
    category: "Layer 1",
    primaryClients: ["Geth", "Besu", "Lodestar", "Teku"],
    minHardware: {
      cpu: "4 Cores",
      ram: "16 GB",
      storage: "500 GB SSD",
    },
    syncStatus: "Fast Sync Ready",
    guidesCount: 3,
  },
  {
    id: "net-arb-one",
    name: "Arbitrum One",
    slug: "arbitrum-one",
    type: "Mainnet",
    ecosystem: "Arbitrum",
    category: "Rollup",
    primaryClients: ["Nitro Node", "Classic Archive"],
    minHardware: {
      cpu: "8 Cores",
      ram: "32 GB DDR4",
      storage: "3 TB NVMe SSD",
    },
    syncStatus: "Active",
    guidesCount: 2,
  },
  {
    id: "net-base-mainnet",
    name: "Base Mainnet",
    slug: "base",
    type: "Mainnet",
    ecosystem: "Base",
    category: "Layer 2",
    primaryClients: ["op-node", "op-geth", "reth"],
    minHardware: {
      cpu: "8 Cores",
      ram: "32 GB",
      storage: "2 TB NVMe",
    },
    syncStatus: "Stable",
    guidesCount: 2,
  },
  {
    id: "net-sol-mainnet",
    name: "Solana Mainnet-Beta",
    slug: "solana",
    type: "Mainnet",
    ecosystem: "Solana",
    category: "Layer 1",
    primaryClients: ["Agave (Solana Labs)", "Firedancer (Frankendancer)"],
    minHardware: {
      cpu: "16 Cores / 32 Threads",
      ram: "128 GB (256 GB recommended)",
      storage: "2x 1 TB NVMe RAID 0",
    },
    syncStatus: "Active",
    guidesCount: 3,
  },
  {
    id: "net-op-sepolia",
    name: "OP Sepolia",
    slug: "op-sepolia",
    type: "Testnet",
    ecosystem: "Optimism",
    category: "Layer 2",
    primaryClients: ["op-node", "op-geth"],
    minHardware: {
      cpu: "4 Cores",
      ram: "16 GB",
      storage: "300 GB SSD",
    },
    syncStatus: "Fast Sync Ready",
    guidesCount: 2,
  },
];

export const LATEST_GUIDES: LatestGuide[] = [
  {
    id: "guide-eth-val",
    title: "Deploying an Ethereum Validator on Holesky Testnet",
    slug: "ethereum-validator-holesky",
    network: "Ethereum",
    networkSlug: "ethereum",
    nodeType: "Validator Node",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    lastVerified: "October 2026",
    summary:
      "Comprehensive runbook for setting up an Execution (Geth) and Consensus (Lighthouse) client pair with validator deposit verification on the Holesky public testnet.",
  },
  {
    id: "guide-arb-nitro",
    title: "Running an Arbitrum One Nitro Full Node with Docker",
    slug: "arbitrum-nitro-docker",
    network: "Arbitrum One",
    networkSlug: "arbitrum-one",
    nodeType: "Full Node",
    difficulty: "Beginner",
    estimatedTime: "30 mins",
    lastVerified: "October 2026",
    summary:
      "Step-by-step containerized deployment of the Arbitrum Nitro execution engine, connecting to an external Ethereum L1 beacon endpoint.",
  },
  {
    id: "guide-base-rpc",
    title: "Setting Up a Dedicated Base Mainnet RPC Endpoint",
    slug: "base-mainnet-rpc",
    network: "Base",
    networkSlug: "base",
    nodeType: "RPC Node",
    difficulty: "Intermediate",
    estimatedTime: "40 mins",
    lastVerified: "October 2026",
    summary:
      "Configure `op-geth` and `op-node` with rate-limiting reverse proxy, health check endpoints, and WebSocket support for low-latency dApp queries.",
  },
  {
    id: "guide-sol-rpc",
    title: "Operating a Non-Voting Solana RPC Node",
    slug: "solana-rpc-node",
    network: "Solana",
    networkSlug: "solana",
    nodeType: "RPC Node",
    difficulty: "Advanced",
    estimatedTime: "60 mins",
    lastVerified: "October 2026",
    summary:
      "High-performance tuning, memory configuration, accounts index optimization, and ledger storage disk partitioning for high-throughput RPC loads.",
  },
];

export const NODE_TYPES_DATA: NodeTypeCategory[] = [
  {
    id: "nt-full",
    title: "Full Nodes",
    slug: "full-nodes",
    badge: "Core Infrastructure",
    description:
      "Stores complete blockchain state and independently verifies every block and transaction against network consensus rules.",
    role: "Transaction propagation, trustless self-verification, and decentralized consensus support.",
    hardwareTier: "Medium",
    storageType: "Pruned state (1 TB - 2 TB SSD)",
  },
  {
    id: "nt-validator",
    title: "Validator Nodes",
    slug: "validator-nodes",
    badge: "Consensus & Staking",
    description:
      "Participates directly in block proposal and attestation by staking native tokens or bonding assets.",
    role: "Securing block production, signing consensus attestations, and earning protocol rewards.",
    hardwareTier: "High",
    storageType: "Low latency NVMe with battery-backed UPS",
  },
  {
    id: "nt-archive",
    title: "Archive Nodes",
    slug: "archive-nodes",
    badge: "Historical Deep Storage",
    description:
      "Maintains the complete historical state at every single block since genesis, enabling arbitrary point-in-time balance checks.",
    role: "Blockchain indexers, block explorers, forensic analytics, and historical state simulation.",
    hardwareTier: "Enterprise",
    storageType: "Massive fast NVMe storage (12 TB - 20 TB+)",
  },
  {
    id: "nt-rpc",
    title: "RPC Nodes & Endpoints",
    slug: "rpc-nodes",
    badge: "Developer Gateway",
    description:
      "Exposes JSON-RPC and WebSocket APIs allowing wallets, automated bots, and decentralized applications to query state and broadcast transactions.",
    role: "High throughput read requests, eth_call executions, and user transaction entry point.",
    hardwareTier: "High",
    storageType: "High IOPS with optimized memory cache",
  },
  {
    id: "nt-sequencer",
    title: "Rollup Sequencers & Provers",
    slug: "sequencers",
    badge: "Layer 2 Scaling",
    description:
      "Orders L2 transactions, batches cryptographic proofs, and submits state roots to the underlying Layer 1 settlement layer.",
    role: "Instant transaction confirmations and Layer 2 state advancement.",
    hardwareTier: "Enterprise",
    storageType: "Ultra-fast low latency storage",
  },
];

export const VERIFICATION_PILLARS: VerificationPillar[] = [
  {
    title: "Official Upstream Sources",
    description:
      "Every runbook is referenced directly from official client repositories, core developer documentation, and verified release tags.",
    iconName: "FileCheck2",
  },
  {
    title: "Hardware Benchmark Testing",
    description:
      "Hardware specifications (CPU cores, RAM footprint, IOPS, and storage growth rates) are based on actual sync profiles rather than estimated minimums.",
    iconName: "Cpu",
  },
  {
    title: "Zero Private Key Access",
    description:
      "NodeDrops scripts and tutorials strictly follow zero-trust security. We never ask for, collect, or store private keys, validator seed phrases, or remote server credentials.",
    iconName: "ShieldAlert",
  },
  {
    title: "Regular Protocol Audits",
    description:
      "Guides display a visible 'Last Verified' timestamp and are re-tested when client software or underlying protocol hard forks occur.",
    iconName: "CheckCircle",
  },
];
