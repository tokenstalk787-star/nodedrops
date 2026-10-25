import { PrismaClient, Role, NetworkType, NetworkStatus, ClientType, Difficulty, VerificationStatus, PublicationStatus, SourceType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting NodeDrops database seed...");

  // 1. Seed Core Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@nodedrops.xyz" },
    update: {},
    create: {
      email: "admin@nodedrops.xyz",
      name: "NodeDrops Infrastructure Team",
      passwordHash: "$2b$12$e8YkYV4Q75pL/W3jYjXk.ecL9qG5z0uM7J9W0E9rU8A.examplehash", // Demonstration hash
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email}`);

  // 2. Seed Node-Type Categories
  const categoriesData = [
    {
      name: "Full Nodes",
      slug: "full-nodes",
      description: "Stores blockchain state and independently verifies every block against network consensus rules.",
      icon: "Server",
      displayOrder: 1,
    },
    {
      name: "Validator Nodes",
      slug: "validator-nodes",
      description: "Participates in block proposal and attestation by staking protocol tokens.",
      icon: "ShieldCheck",
      displayOrder: 2,
    },
    {
      name: "Archive Nodes",
      slug: "archive-nodes",
      description: "Maintains complete historical state at every block since genesis for indexers and explorers.",
      icon: "HardDrive",
      displayOrder: 3,
    },
    {
      name: "RPC Nodes",
      slug: "rpc-nodes",
      description: "Exposes JSON-RPC and WebSocket APIs for applications, bots, and wallets to query state.",
      icon: "Network",
      displayOrder: 4,
    },
    {
      name: "Rollup Sequencers",
      slug: "sequencers",
      description: "Batches Layer 2 transactions and submits cryptographic proofs to Layer 1.",
      icon: "Layers",
      displayOrder: 5,
    },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, description: cat.description, displayOrder: cat.displayOrder },
        create: cat,
      })
    )
  );
  console.log(`✅ Seeded ${categories.length} node-type categories.`);

  // 3. Seed Verified Upstream Sources
  const sourcesData = [
    {
      name: "Ethereum Official Client Documentation",
      url: "https://ethereum.org/en/developers/docs/nodes-and-clients/",
      sourceType: SourceType.OFFICIAL_DOCS,
      reliabilityScore: 100,
    },
    {
      name: "Go-Ethereum (Geth) GitHub Repository",
      url: "https://github.com/ethereum/go-ethereum",
      sourceType: SourceType.UPSTREAM_REPO,
      reliabilityScore: 100,
    },
    {
      name: "Lighthouse Book (Sigma Prime)",
      url: "https://lighthouse-book.sigmaprime.io/",
      sourceType: SourceType.OFFICIAL_DOCS,
      reliabilityScore: 100,
    },
    {
      name: "Arbitrum Nitro Official Documentation",
      url: "https://docs.arbitrum.io/node-running/how-tos/build-nitro-node",
      sourceType: SourceType.OFFICIAL_DOCS,
      reliabilityScore: 100,
    },
    {
      name: "Base Node Operator Documentation",
      url: "https://docs.base.org/guides/run-a-base-node/",
      sourceType: SourceType.OFFICIAL_DOCS,
      reliabilityScore: 100,
    },
    {
      name: "Solana Validator Operations Guide",
      url: "https://docs.solanalabs.com/operations",
      sourceType: SourceType.OFFICIAL_DOCS,
      reliabilityScore: 100,
    },
  ];

  const sources = await Promise.all(
    sourcesData.map((s) =>
      prisma.source.upsert({
        where: { url: s.url },
        update: { name: s.name, reliabilityScore: s.reliabilityScore },
        create: s,
      })
    )
  );
  console.log(`✅ Seeded ${sources.length} verified sources.`);

  // 4. Seed Verified Networks
  const networksData = [
    {
      name: "Ethereum Mainnet",
      slug: "ethereum",
      symbol: "ETH",
      chainId: "1",
      networkType: NetworkType.MAINNET,
      category: "Layer 1",
      layer: "Layer 1",
      consensus: "Proof-of-Stake",
      status: NetworkStatus.ACTIVE,
      websiteUrl: "https://ethereum.org",
      docsUrl: "https://ethereum.org/en/developers/docs/",
      explorerUrl: "https://etherscan.io",
      rpcUrl: "https://eth.llamarpc.com",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: "Ethereum Holesky",
      slug: "holesky",
      symbol: "ETH",
      chainId: "17000",
      networkType: NetworkType.TESTNET,
      category: "Layer 1",
      layer: "Layer 1",
      consensus: "Proof-of-Stake",
      status: NetworkStatus.ACTIVE,
      websiteUrl: "https://holesky.ethpandaops.io",
      docsUrl: "https://ethereum.org/en/developers/docs/networks/#holesky",
      explorerUrl: "https://holesky.etherscan.io",
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: "Arbitrum One",
      slug: "arbitrum-one",
      symbol: "ARB",
      chainId: "42161",
      networkType: NetworkType.MAINNET,
      category: "Rollup",
      layer: "Layer 2 Rollup",
      consensus: "Nitro Multi-Round Fault Proof",
      status: NetworkStatus.ACTIVE,
      websiteUrl: "https://arbitrum.io",
      docsUrl: "https://docs.arbitrum.io",
      explorerUrl: "https://arbiscan.io",
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: "Base Mainnet",
      slug: "base",
      symbol: "ETH",
      chainId: "8453",
      networkType: NetworkType.MAINNET,
      category: "Layer 2",
      layer: "Layer 2 OP Stack",
      consensus: "Optimistic Sequencing",
      status: NetworkStatus.ACTIVE,
      websiteUrl: "https://base.org",
      docsUrl: "https://docs.base.org",
      explorerUrl: "https://basescan.org",
      isFeatured: true,
      sortOrder: 4,
    },
    {
      name: "Solana Mainnet-Beta",
      slug: "solana",
      symbol: "SOL",
      chainId: "101",
      networkType: NetworkType.MAINNET,
      category: "Layer 1",
      layer: "Layer 1",
      consensus: "Proof-of-History + PoS",
      status: NetworkStatus.ACTIVE,
      websiteUrl: "https://solana.com",
      docsUrl: "https://docs.solanalabs.com",
      explorerUrl: "https://solscan.io",
      isFeatured: true,
      sortOrder: 5,
    },
  ];

  const seededNetworks: Record<string, string> = {};
  for (const net of networksData) {
    const record = await prisma.network.upsert({
      where: { slug: net.slug },
      update: { name: net.name, status: net.status, isFeatured: net.isFeatured, sortOrder: net.sortOrder },
      create: net,
    });
    seededNetworks[net.slug] = record.id;
  }
  console.log(`✅ Seeded ${Object.keys(seededNetworks).length} networks.`);

  // 5. Seed Client Software for Networks
  const clientsData = [
    { networkId: seededNetworks["ethereum"], name: "Go-Ethereum (Geth)", language: "Go", clientType: ClientType.EXECUTION, recommendedVersion: "v1.14.8" },
    { networkId: seededNetworks["ethereum"], name: "Lighthouse", language: "Rust", clientType: ClientType.CONSENSUS, recommendedVersion: "v5.3.0" },
    { networkId: seededNetworks["ethereum"], name: "Nethermind", language: "C#", clientType: ClientType.EXECUTION, recommendedVersion: "v1.28.0" },
    { networkId: seededNetworks["holesky"], name: "Go-Ethereum (Geth)", language: "Go", clientType: ClientType.EXECUTION, recommendedVersion: "v1.14.8" },
    { networkId: seededNetworks["holesky"], name: "Lodestar", language: "TypeScript", clientType: ClientType.CONSENSUS, recommendedVersion: "v1.20.0" },
    { networkId: seededNetworks["arbitrum-one"], name: "Arbitrum Nitro", language: "Go / C++", clientType: ClientType.COMBINED, recommendedVersion: "v3.1.2" },
    { networkId: seededNetworks["base"], name: "op-geth / op-node", language: "Go", clientType: ClientType.COMBINED, recommendedVersion: "v1.101408.0" },
    { networkId: seededNetworks["solana"], name: "Agave (Solana Labs)", language: "Rust", clientType: ClientType.COMBINED, recommendedVersion: "v1.18.23" },
  ];

  for (const client of clientsData) {
    const existing = await prisma.clientSoftware.findFirst({
      where: { networkId: client.networkId, name: client.name },
    });
    if (!existing) {
      await prisma.clientSoftware.create({ data: client });
    }
  }
  console.log(`✅ Seeded client software packages.`);

  // 6. Seed Empirical Hardware Requirements
  const hardwareData = [
    {
      networkId: seededNetworks["ethereum"],
      nodeType: "Full Node",
      minCpu: "4 Cores (8 Threads)",
      recCpu: "8 Cores (16 Threads)",
      minRamGb: 16,
      recRamGb: 32,
      minStorageGb: 2000,
      recStorageGb: 4000,
      storageType: "NVMe SSD (>= 3000 MB/s)",
      bandwidthMbps: 100,
      notes: "Requires dedicated execution and consensus client pair. SSD IOPS is the primary performance bottleneck.",
    },
    {
      networkId: seededNetworks["holesky"],
      nodeType: "Validator Node",
      minCpu: "4 Cores",
      recCpu: "4 Cores (8 Threads)",
      minRamGb: 16,
      recRamGb: 32,
      minStorageGb: 500,
      recStorageGb: 1000,
      storageType: "NVMe SSD",
      bandwidthMbps: 50,
      notes: "Holesky public testnet requires 32 testnet ETH to deposit a validator key.",
    },
    {
      networkId: seededNetworks["arbitrum-one"],
      nodeType: "Full Node",
      minCpu: "8 Cores",
      recCpu: "16 Cores",
      minRamGb: 32,
      recRamGb: 64,
      minStorageGb: 3000,
      recStorageGb: 5000,
      storageType: "NVMe SSD (High IOPS)",
      bandwidthMbps: 100,
      notes: "Requires connection to an active Ethereum L1 beacon endpoint to validate fraud proof data.",
    },
    {
      networkId: seededNetworks["solana"],
      nodeType: "RPC Node",
      minCpu: "16 Cores / 32 Threads",
      recCpu: "32 Cores / 64 Threads",
      minRamGb: 128,
      recRamGb: 256,
      minStorageGb: 2000,
      recStorageGb: 4000,
      storageType: "2x 1 TB NVMe RAID 0 for Accounts + Ledger",
      bandwidthMbps: 1000,
      notes: "High memory utilization for accounts index caching. Symmetric gigabit connection required.",
    },
  ];

  for (const hw of hardwareData) {
    const existing = await prisma.hardwareRequirement.findFirst({
      where: { networkId: hw.networkId, nodeType: hw.nodeType },
    });
    if (!existing) {
      await prisma.hardwareRequirement.create({ data: hw });
    }
  }
  console.log(`✅ Seeded hardware requirements.`);

  // 7. Seed Verified Guides
  const categoryMap: Record<string, string> = {};
  for (const c of categories) {
    categoryMap[c.slug] = c.id;
  }

  const guidesData = [
    {
      title: "Deploying an Ethereum Validator on Holesky Testnet",
      slug: "ethereum-validator-holesky",
      summary: "Comprehensive runbook for setting up an Execution (Geth) and Consensus (Lighthouse) client pair with validator deposit verification on the Holesky public testnet.",
      content: `# Ethereum Validator on Holesky Testnet

## Architecture Overview
Running a validator requires two peer-to-peer software clients communicating over the Engine API (port 8551 with JWT secret authentication):
1. **Execution Client**: Go-Ethereum (Geth) executes transactions and manages world state.
2. **Consensus Client**: Lighthouse processes Casper FFG finality and validator attestations.

## Prerequisites
- Hardware: 4 Cores, 16 GB RAM, 500 GB NVMe SSD.
- Operating System: Ubuntu 24.04 LTS or Debian 12.
- Firewall: Inbound TCP/UDP 30303 (Geth P2P), TCP/UDP 9000 (Lighthouse P2P).
- Elevated Permissions: Sudo privileges required for systemd and directory creation.

## Step 1: Create JWT Secret
Generate an authenticated token so Geth and Lighthouse communicate securely without unauthorized access:
\`\`\`bash
sudo mkdir -p /var/lib/ethereum/jwt
openssl rand -hex 32 | sudo tee /var/lib/ethereum/jwt/jwt.hex
sudo chmod 600 /var/lib/ethereum/jwt/jwt.hex
\`\`\`

## Step 2: Install Go-Ethereum (Geth)
Install official stable binary from Ethereum PPA:
\`\`\`bash
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update && sudo apt-get install -y geth
\`\`\`

## Step 3: Run Geth Execution Service
\`\`\`bash
geth --holesky --authrpc.jwtpath /var/lib/ethereum/jwt/jwt.hex --authrpc.addr 127.0.0.1 --authrpc.port 8551 --http --http.api eth,net,web3
\`\`\`

## Expected Output
Geth terminal log will confirm:
\`\`\`text
INFO [10-25|05:00:00.123] Started P2P networking                   self=enode://...
INFO [10-25|05:00:01.456] IPC endpoint opened                      url=/var/lib/geth/geth.ipc
INFO [10-25|05:00:02.789] HTTP server started                      endpoint=127.0.0.1:8545
INFO [10-25|05:00:03.012] WebSocket enabled                        url=ws://127.0.0.1:8546
INFO [10-25|05:00:04.234] Initialized Engine API endpoint          url=127.0.0.1:8551
\`\`\`

## Troubleshooting
### Peer Discovery Failure (0 Peers)
If Geth stays at 0 connected peers:
1. Verify outbound UDP port 30303 is open in your cloud VPS security group.
2. Verify system clock is synchronized using \`timedatectl status\`. NTP time drift breaks consensus discovery.

### Disk Space Exhaustion
If disk usage reaches 90%:
\`\`\`bash
# Run Geth database prune while node is offline
sudo systemctl stop geth
geth snapshot prune-state --datadir /var/lib/ethereum/geth
sudo systemctl start geth
\`\`\`
`,
      difficulty: Difficulty.INTERMEDIATE,
      estimatedMinutes: 45,
      authorId: adminUser.id,
      categoryId: categoryMap["validator-nodes"],
      verificationStatus: VerificationStatus.OFFICIAL_DOCS_VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
      verifiedAt: new Date("2026-10-20"),
    },
    {
      title: "Running an Arbitrum One Nitro Full Node with Docker",
      slug: "arbitrum-nitro-docker",
      summary: "Step-by-step containerized deployment of the Arbitrum Nitro execution engine, connecting to an external Ethereum L1 beacon endpoint.",
      content: `# Arbitrum One Nitro Node Setup

## Prerequisites
- Hardware: 8 Cores, 32 GB RAM, 3 TB NVMe SSD.
- Docker Engine & Docker Compose v2 installed.
- Synced Ethereum L1 RPC endpoint (Execution + Beacon).
- Disk Partition: High IOPS NVMe SSD mounted at \`/var/lib/nitro\`.

## Step 1: Create Host Storage Volume
Create directory with appropriate permissions:
\`\`\`bash
sudo mkdir -p /var/lib/nitro
sudo chown -R 1000:1000 /var/lib/nitro
\`\`\`

## Step 2: Docker Compose Configuration
Create \`docker-compose.yml\`:
\`\`\`yaml
services:
  nitro:
    image: 'offchainlabs/nitro-node:v3.1.2-beta'
    container_name: arbitrum-nitro
    restart: unless-stopped
    ports:
      - '8547:8547'
      - '8548:8548'
    volumes:
      - '/var/lib/nitro:/home/user/.arbitrum'
    command:
      - --parent-chain.connection.url=http://l1-rpc.internal:8545
      - --chain.id=42161
      - --http.api=net,web3,eth
      - --http.addr=0.0.0.0
      - --http.vhosts=*
      - --http.corsdomain=*
\`\`\`

## Step 3: Launch Nitro Container
Start container in detached mode:
\`\`\`bash
docker compose up -d
\`\`\`

## Expected Output
Verify logs using \`docker compose logs -f\`:
\`\`\`text
[INFO] Launching Arbitrum Nitro Node version v3.1.2
[INFO] Connected to parent chain at http://l1-rpc.internal:8545
[INFO] Catching up from L1 inbox sequence... block=24150012
\`\`\`

## Troubleshooting
### Parent Chain Connection Timeout
Ensure your Ethereum L1 node allows HTTP connections from the Docker bridge subnet (\`172.17.0.0/16\`).
`,
      difficulty: Difficulty.BEGINNER,
      estimatedMinutes: 30,
      authorId: adminUser.id,
      categoryId: categoryMap["full-nodes"],
      verificationStatus: VerificationStatus.OFFICIAL_DOCS_VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
      verifiedAt: new Date("2026-10-22"),
    },
    {
      title: "Setting Up a Dedicated Base Mainnet RPC Endpoint",
      slug: "base-mainnet-rpc",
      summary: "Configure op-geth and op-node with rate-limiting reverse proxy, health check endpoints, and WebSocket support for low-latency dApp queries.",
      content: `# Base Mainnet Dedicated RPC Node

## Overview
Base runs on the OP Stack architecture consisting of:
1. **op-node**: Consensus client syncing Layer 1 rollups.
2. **op-geth**: Execution engine processing EVM transactions.

## Prerequisites
- Hardware: 8 Cores, 32 GB RAM, 2 TB NVMe SSD.
- OS: Ubuntu 22.04 LTS or newer.
- L1 Execution + Beacon node (Ethereum Mainnet).

## Step 1: Download Official Base Genesis & Rollup Config
\`\`\`bash
mkdir -p /var/lib/base/config
curl -sL https://raw.githubusercontent.com/base-org/node/main/mainnet/genesis.json -o /var/lib/base/config/genesis.json
curl -sL https://raw.githubusercontent.com/base-org/node/main/mainnet/rollup.json -o /var/lib/base/config/rollup.json
\`\`\`

## Step 2: Initialize op-geth Data Directory
\`\`\`bash
op-geth init --datadir=/var/lib/base/geth-data /var/lib/base/config/genesis.json
\`\`\`

## Step 3: Start Node Services
Launch \`op-geth\` and \`op-node\` connecting over Engine API with shared JWT secret.

## Expected Output
\`\`\`text
INFO [Base-Node] Sequencer connection established. Head block: 19854201
INFO [Base-Geth] Imported new chain segment blocks=128 txs=1402 mgas=142.5
\`\`\`
`,
      difficulty: Difficulty.INTERMEDIATE,
      estimatedMinutes: 40,
      authorId: adminUser.id,
      categoryId: categoryMap["rpc-nodes"],
      verificationStatus: VerificationStatus.OFFICIAL_DOCS_VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
      verifiedAt: new Date("2026-10-23"),
    },
    {
      title: "Operating a Non-Voting Solana RPC Node",
      slug: "solana-rpc-node",
      summary: "High-performance tuning, memory configuration, accounts index optimization, and ledger storage disk partitioning for high-throughput RPC loads.",
      content: `# Solana Non-Voting RPC Node Operations

## Overview
A non-voting Solana node downloads ledger shredded blocks and updates the state machine without signing voting transactions, providing clean JSON-RPC access.

## Prerequisites
- Hardware: 16 Cores (32 Threads), 128 GB RAM (256 GB recommended), 2x 1 TB NVMe RAID 0.
- Network: 1 Gbps symmetric unmetered fiber.
- Linux Kernel: Sysctl tuning required for UDP buffers and virtual memory map counts.

## Step 1: Linux System Tuning
\`\`\`bash
sudo bash -c 'cat > /etc/sysctl.d/21-solana-validator.conf <<EOF
net.core.rmem_max=134217728
net.core.rmem_default=134217728
net.core.wmem_max=134217728
net.core.wmem_default=134217728
vm.max_map_count=1000000
EOF'
sudo sysctl -p /etc/sysctl.d/21-solana-validator.conf
\`\`\`

## Step 2: Launch Agave RPC Daemon
\`\`\`bash
agave-validator \
  --identity /var/lib/solana/identity.json \
  --no-voting \
  --ledger /var/lib/solana/ledger \
  --accounts /var/lib/solana/accounts \
  --rpc-port 8899 \
  --full-rpc-api \
  --entrypoint entrypoint.mainnet-beta.solana.com:8001
\`\`\`
`,
      difficulty: Difficulty.ADVANCED,
      estimatedMinutes: 60,
      authorId: adminUser.id,
      categoryId: categoryMap["rpc-nodes"],
      verificationStatus: VerificationStatus.OFFICIAL_DOCS_VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
      verifiedAt: new Date("2026-10-24"),
    },
    {
      title: "Ethereum Mainnet Staking Pool Architecture (Draft)",
      slug: "ethereum-mainnet-staking-draft",
      summary: "Draft research runbook for distributed validator technology (DVT) on Ethereum mainnet.",
      content: `# Ethereum Mainnet Staking (Draft)
This guide is an internal research draft and must never be exposed publicly until reviewed.
`,
      difficulty: Difficulty.ADVANCED,
      estimatedMinutes: 90,
      authorId: adminUser.id,
      categoryId: categoryMap["validator-nodes"],
      verificationStatus: VerificationStatus.UNDER_REVIEW,
      publicationStatus: PublicationStatus.DRAFT, // DRAFT: Must be hidden from public view
      verifiedAt: null,
    },
  ];

  for (const g of guidesData) {
    const guide = await prisma.guide.upsert({
      where: { slug: g.slug },
      update: {
        title: g.title,
        summary: g.summary,
        content: g.content,
        difficulty: g.difficulty,
        categoryId: g.categoryId,
        verificationStatus: g.verificationStatus,
        publicationStatus: g.publicationStatus,
        verifiedAt: g.verifiedAt,
      },
      create: g,
    });

    // Link Guide to Network
    let targetNetworkSlug = "";
    if (g.slug.includes("holesky")) targetNetworkSlug = "holesky";
    else if (g.slug.includes("arbitrum")) targetNetworkSlug = "arbitrum-one";
    else if (g.slug.includes("base")) targetNetworkSlug = "base";
    else if (g.slug.includes("solana")) targetNetworkSlug = "solana";
    else if (g.slug.includes("ethereum")) targetNetworkSlug = "ethereum";

    if (targetNetworkSlug && seededNetworks[targetNetworkSlug]) {
      await prisma.networkGuide.upsert({
        where: {
          networkId_guideId: {
            networkId: seededNetworks[targetNetworkSlug],
            guideId: guide.id,
          },
        },
        update: {},
        create: {
          networkId: seededNetworks[targetNetworkSlug],
          guideId: guide.id,
          isPrimary: true,
        },
      });
    }

    // Link Guide to Sources
    if (sources[0]) {
      await prisma.guideSource.upsert({
        where: {
          guideId_sourceId: {
            guideId: guide.id,
            sourceId: sources[0].id,
          },
        },
        update: {},
        create: {
          guideId: guide.id,
          sourceId: sources[0].id,
          notes: "Official client documentation reference",
        },
      });
    }
  }
  console.log(`✅ Seeded verified guides and relational junctions.`);

  // 8. Seed Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "INITIAL_DATABASE_SEED",
      entityType: "SYSTEM",
      metadata: { seededAt: new Date().toISOString(), version: "1.0.0" },
      ipAddress: "127.0.0.1",
    },
  });
  console.log(`✅ Initial audit log entry recorded.`);

  console.log("🚀 NodeDrops database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
