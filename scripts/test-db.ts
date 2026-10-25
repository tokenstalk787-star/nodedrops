import { PrismaClient } from "@prisma/client";
import { checkDatabaseConnection } from "../src/lib/db-check";
import { getAllNetworks, getNetworkBySlug } from "../src/lib/repositories/network.repository";
import { getAllGuides, getGuideBySlug } from "../src/lib/repositories/guide.repository";
import { createContactSubmission } from "../src/lib/repositories/submission.repository";

const prisma = new PrismaClient();

async function runDatabaseTests() {
  console.log("==================================================");
  console.log("🔍 RUNNING NODEDROPS DATABASE VALIDATION TESTS");
  console.log("==================================================");

  // 1. Connection Check
  const health = await checkDatabaseConnection();
  console.log("1. Connection Health:", health.connected ? "✅ PASS" : "❌ FAIL");
  console.log("   Counts:", JSON.stringify(health.counts));

  if (!health.connected) {
    throw new Error(`Database connection failed: ${health.error}`);
  }

  // 2. Test Reading Networks
  const networks = await getAllNetworks();
  console.log(`2. Read Networks: ✅ PASS (Found ${networks.length} networks)`);
  if (networks.length === 0) {
    throw new Error("No networks found in database!");
  }
  const eth = await getNetworkBySlug("ethereum");
  if (!eth || eth.clients.length === 0 || eth.hardwareRequirements.length === 0) {
    throw new Error("Relational query for Ethereum network failed or missing relations!");
  }
  console.log(`   Ethereum clients found: ${eth.clients.map((c) => c.name).join(", ")}`);
  console.log(`   Ethereum hardware profiles: ${eth.hardwareRequirements.length}`);

  // 3. Test Reading Guides
  const guides = await getAllGuides();
  console.log(`3. Read Guides: ✅ PASS (Found ${guides.length} guides)`);
  if (guides.length === 0) {
    throw new Error("No guides found in database!");
  }
  const sampleGuide = await getGuideBySlug(guides[0].slug);
  if (!sampleGuide || sampleGuide.guideSources.length === 0) {
    throw new Error("Relational query for Guide with sources failed!");
  }
  console.log(`   Guide '${sampleGuide.title}' sources linked: ${sampleGuide.guideSources.length}`);

  // 4. Test Invalid Data Rejection (Unique Constraint Violation)
  console.log("4. Testing Invalid Data Rejection (Duplicate Slug Constraint)...");
  let rejectedSuccessfully = false;
  try {
    await prisma.network.create({
      data: {
        name: "Duplicate Ethereum",
        slug: "ethereum", // Duplicate of existing slug
        symbol: "ETH2",
      },
    });
  } catch (error) {
    rejectedSuccessfully = true;
    console.log("   ✅ Expected rejection caught: Duplicate slug rejected by MySQL unique index.");
  }

  if (!rejectedSuccessfully) {
    throw new Error("Invalid duplicate slug was NOT rejected by database!");
  }

  // 5. Test Contact Submission Creation
  console.log("5. Testing Contact Submission Repository...");
  const submission = await createContactSubmission({
    name: "Validator Operator",
    email: "operator@example.com",
    subject: "Node Sync Optimization Feedback",
    message: "Verified Lighthouse v5.3.0 memory footprint on Ubuntu 24.04 LTS.",
    ipAddress: "127.0.0.1",
  });
  console.log(`   ✅ Contact submission saved: ID ${submission.id} (Status: ${submission.status})`);

  // Clean up test submission
  await prisma.contactSubmission.delete({ where: { id: submission.id } });
  console.log("   ✅ Cleaned up temporary test submission.");

  console.log("==================================================");
  console.log("🎉 ALL DATABASE VERIFICATION TESTS PASSED (5/5)!");
  console.log("==================================================");
}

runDatabaseTests()
  .catch((e) => {
    console.error("❌ Test suite failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
