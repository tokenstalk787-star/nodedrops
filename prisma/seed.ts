import {
  IncentiveStatus,
  OpportunityStatus,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

// Keep real listings conservative: only record what the linked source supports.
// Incentives are not promises of eligibility or future rewards.
const opportunities = [
  {
    name: "La Tanda Chain Incentivized Testnet",
    slug: "la-tanda-chain-incentivized-testnet",
    summary:
      "A Cosmos SDK-based testnet recruiting node operators and validators. The project team reported an open participation program in its October 2026 update; check the latest onboarding steps, eligibility, and slot availability before spending on infrastructure.",
    category: "Node",
    network: "La Tanda Chain",
    status: OpportunityStatus.ACTIVE,
    incentiveStatus: IncentiveStatus.POTENTIAL,
    difficulty: "Advanced",
    estimatedCostUsd: null,
    officialUrl: "https://latanda.online/chain/",
    lastVerifiedAt: new Date("2026-10-14T00:00:00.000Z"),
    sourceUrl:
      "https://forum.cosmos.network/t/la-tanda-chain-incentivized-testnet-live-validators-node-operators-welcome-cosmos-sdk-v0-53-6/16709",
    verificationNotes:
      "Project-team forum update dated October 6, 2026 describes an active onboarding process and support-delegation tiers. The post also clarifies that testnet LTD has no monetary value. Confirm current availability and terms with the project before participating; no reward is guaranteed.",
    isDemo: false,
  },
  {
    name: "Logos Testnet v0.3",
    slug: "logos-testnet-v03",
    summary:
      "The Logos team announced testnet v0.3 on September 30, 2026, with updates to the privacy-preserving stack and node client. Review the release notes and current node requirements before updating or joining. No incentive is recorded in this listing.",
    category: "Testnet",
    network: "Logos",
    status: OpportunityStatus.ACTIVE,
    incentiveStatus: IncentiveStatus.NOT_ANNOUNCED,
    difficulty: "Intermediate",
    estimatedCostUsd: null,
    officialUrl: "https://blog.logos.co/article/logos-testnet-v03-live",
    lastVerifiedAt: new Date("2026-10-14T00:00:00.000Z"),
    sourceUrl: "https://blog.logos.co/article/logos-testnet-v03-live",
    verificationNotes:
      "Official Logos blog post dated September 30, 2026 announces testnet v0.3 and says node operators should update to the latest client. The announcement reviewed here does not establish a token reward or airdrop; check official channels for subsequent changes.",
    isDemo: false,
  },
  {
    name: "Demo EVM Testnet",
    slug: "demo-evm-testnet",
    summary:
      "Demonstration record for testing the NodeDrops opportunity directory and search filters.",
    category: "Testnet",
    network: "Demo EVM",
    status: OpportunityStatus.ACTIVE,
    incentiveStatus: IncentiveStatus.NOT_ANNOUNCED,
    difficulty: "Beginner",
    estimatedCostUsd: null,
    officialUrl: null,
    lastVerifiedAt: null,
    sourceUrl: null,
    verificationNotes: null,
    isDemo: true,
  },
  {
    name: "Demo Node Operator Network",
    slug: "demo-node-operator-network",
    summary:
      "Demonstration record for testing node-operation opportunity listings.",
    category: "Node",
    network: "Demo Network",
    status: OpportunityStatus.UPCOMING,
    incentiveStatus: IncentiveStatus.POTENTIAL,
    difficulty: "Intermediate",
    estimatedCostUsd: null,
    officialUrl: null,
    lastVerifiedAt: null,
    sourceUrl: null,
    verificationNotes: null,
    isDemo: true,
  },
  {
    name: "Demo Developer Sandbox",
    slug: "demo-developer-sandbox",
    summary:
      "Demonstration record for testing developer-focused blockchain tasks.",
    category: "Developer",
    network: "Demo Network",
    status: OpportunityStatus.ACTIVE,
    incentiveStatus: IncentiveStatus.NOT_ANNOUNCED,
    difficulty: "Beginner",
    estimatedCostUsd: null,
    officialUrl: null,
    lastVerifiedAt: null,
    sourceUrl: null,
    verificationNotes: null,
    isDemo: true,
  },
];

async function main() {
  for (const opportunity of opportunities) {
    await prisma.opportunity.upsert({
      where: { slug: opportunity.slug },
      update: opportunity,
      create: opportunity,
    });
  }

  const realCount = opportunities.filter((item) => !item.isDemo).length;
  const demoCount = opportunities.filter((item) => item.isDemo).length;

  console.log(
    `Seeded/updated ${realCount} source-backed listings and ${demoCount} demo records.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
