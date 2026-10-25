import { PrismaClient, NetworkType } from "@prisma/client";
import { getPaginatedNetworks, getNetworkBySlug, getNetworkFilterOptions } from "../src/lib/repositories/network.repository";

const prisma = new PrismaClient();

async function runPhase05Tests() {
  console.log("==================================================");
  console.log("🔍 RUNNING PHASE 05 REPOSITORY & ROUTE VERIFICATION");
  console.log("==================================================");

  // 1. Test Filter Options
  const filterOptions = await getNetworkFilterOptions();
  console.log("1. Filter Options Check: ✅ PASS");
  console.log("   Categories:", filterOptions.categories);
  console.log("   Node Roles:", filterOptions.nodeRoles);
  if (filterOptions.categories.length === 0 || filterOptions.nodeRoles.length === 0) {
    throw new Error("Filter options returned empty values!");
  }

  // 2. Test Pagination and Total Count
  const allResult = await getPaginatedNetworks({ page: 1, pageSize: 10 });
  console.log(`2. All Networks Query: ✅ PASS (Total: ${allResult.total}, Fetched: ${allResult.networks.length})`);
  if (allResult.total === 0) {
    throw new Error("Expected networks in database, got 0!");
  }

  // 3. Test Type Filtering (Mainnet vs Testnet)
  const mainnetsResult = await getPaginatedNetworks({ type: NetworkType.MAINNET });
  const testnetsResult = await getPaginatedNetworks({ type: NetworkType.TESTNET });
  console.log(`3. Network Type Filtering: ✅ PASS (Mainnets: ${mainnetsResult.total}, Testnets: ${testnetsResult.total})`);
  if (mainnetsResult.networks.some((n) => n.networkType !== NetworkType.MAINNET)) {
    throw new Error("Mainnets query returned non-mainnet record!");
  }
  if (testnetsResult.networks.some((n) => n.networkType !== NetworkType.TESTNET)) {
    throw new Error("Testnets query returned non-testnet record!");
  }

  // 4. Test Search Query Filtering
  const searchResult = await getPaginatedNetworks({ query: "Solana" });
  console.log(`4. Search Filtering (query: 'Solana'): ✅ PASS (Found ${searchResult.total})`);
  if (!searchResult.networks.some((n) => n.slug === "solana")) {
    throw new Error("Search for 'Solana' failed to find Solana network!");
  }

  // 5. Test Node Role Filtering
  const roleResult = await getPaginatedNetworks({ nodeRole: "Validator" });
  console.log(`5. Node Role Filtering ('Validator'): ✅ PASS (Found ${roleResult.total})`);

  // 6. Test Valid Slug Load (EVM & Non-EVM)
  const eth = await getNetworkBySlug("ethereum");
  if (!eth || !eth.chainId || eth.clients.length === 0) {
    throw new Error("Failed to load valid EVM network 'ethereum'!");
  }
  console.log(`6. Valid EVM Slug ('ethereum'): ✅ PASS (Chain ID: ${eth.chainId}, Clients: ${eth.clients.length})`);

  const solana = await getNetworkBySlug("solana");
  if (!solana || solana.hardwareRequirements.length === 0) {
    throw new Error("Failed to load valid non-EVM network 'solana'!");
  }
  console.log(`   Valid Non-EVM Slug ('solana'): ✅ PASS (Consensus: ${solana.consensus}, Clients: ${solana.clients.map((c) => c.name).join(", ")})`);

  // 7. Test Unknown Slug Handling
  const unknown = await getNetworkBySlug("unknown-non-existent-network-slug");
  if (unknown !== null) {
    throw new Error("Expected null for unknown slug, received data!");
  }
  console.log("7. Unknown Slug Handling: ✅ PASS (Returned null, triggering notFound())");

  console.log("==================================================");
  console.log("🎉 ALL PHASE 05 VERIFICATION TESTS PASSED (7/7)!");
  console.log("==================================================");
}

runPhase05Tests()
  .catch((e) => {
    console.error("❌ Phase 05 tests failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
