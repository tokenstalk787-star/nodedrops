
import {
  IncentiveStatus,
  OpportunityStatus,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

const opportunities = [
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

  console.log(
    `Seeded ${opportunities.length} demo opportunities with isDemo=true.`,
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
