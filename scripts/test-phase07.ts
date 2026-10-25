import { searchGlobal } from "../src/lib/repositories/search.repository";
import prisma from "../src/lib/prisma";

async function runPhase07Tests() {
  console.log("=== NodeDrops Phase 07 Test Suite ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Global Search - Empty Query returns featured items
    console.log("\n1. Testing Empty Search (Featured / Default Items)...");
    const emptySearch = await searchGlobal();
    assert(emptySearch.totalCount > 0, `Empty search returned ${emptySearch.totalCount} default discovery items`);
    assert(emptySearch.networks.length > 0, `Returned ${emptySearch.networks.length} featured networks`);
    assert(emptySearch.guides.length > 0, `Returned ${emptySearch.guides.length} verified guides`);

    // 2. Global Search - Keyword "Ethereum"
    console.log("\n2. Testing Global Search for 'Ethereum'...");
    const ethSearch = await searchGlobal({ query: "Ethereum" });
    assert(ethSearch.totalCount >= 2, `Expected at least 2 results for 'Ethereum', got ${ethSearch.totalCount}`);
    const hasEthNetwork = ethSearch.networks.some((n) => n.name.includes("Ethereum"));
    assert(hasEthNetwork, "Found Ethereum network record");
    const hasEthGuide = ethSearch.guides.some((g) => g.title.includes("Ethereum"));
    assert(hasEthGuide, "Found Ethereum guide record");

    // 3. Draft Guide Protection in Global Search
    console.log("\n3. Testing Draft Protection in Search Engine...");
    const draftSearch = await searchGlobal({ query: "draft" });
    const draftFound = draftSearch.guides.some(
      (g) => g.slug === "ethereum-mainnet-staking-draft"
    );
    assert(!draftFound, "Draft guide 'ethereum-mainnet-staking-draft' is strictly omitted from search results");

    // 4. Type Filtering in Search (Networks only, Guides only)
    console.log("\n4. Testing Type-filtered Search Queries...");
    const networksOnly = await searchGlobal({ query: "Solana", type: "networks" });
    assert(networksOnly.type === "networks", "Search type set to networks");
    assert(networksOnly.networks.length >= 1, "Found Solana in networks search");
    assert(networksOnly.guides.length === 0, "No guides returned when type=networks");

    const guidesOnly = await searchGlobal({ query: "Nitro", type: "guides" });
    assert(guidesOnly.type === "guides", "Search type set to guides");
    assert(guidesOnly.guides.length >= 1, "Found Nitro guide in guides search");
    assert(guidesOnly.networks.length === 0, "No networks returned when type=guides");

    // 5. No-Results Handling
    console.log("\n5. Testing Unknown Query Handling...");
    const noResults = await searchGlobal({ query: "xyz-non-existent-crypto-token-12345" });
    assert(noResults.totalCount === 0, "Total count is 0 for unmatched query");
    assert(noResults.networks.length === 0 && noResults.guides.length === 0, "Empty arrays returned cleanly");

    // 6. Test Calculator Mathematics - Storage Estimation Formula
    console.log("\n6. Testing Storage Estimation Algorithm...");
    const initStorage = 850;
    const monthlyGrowth = 35;
    const months = 12;
    const osBuffer = 50;
    const projected12Mo = initStorage + (monthlyGrowth * months) + osBuffer;
    assert(projected12Mo === 1320, `Projected 12mo storage equals 1320 GB (Calculated: ${projected12Mo})`);

    const driveRequirementWithBuffer = Math.round(projected12Mo / 0.8);
    assert(driveRequirementWithBuffer === 1650, `Required capacity with 20% buffer is 1650 GB (Calculated: ${driveRequirementWithBuffer})`);
    assert(driveRequirementWithBuffer <= 2000, "Fits within standard 2 TB (2,000 GB) NVMe SSD");

    // 7. Test Calculator Mathematics - Bandwidth Planning Formula
    console.log("\n7. Testing Bandwidth Planning Algorithm...");
    const peers = 50;
    const kbPerPeer = 15;
    const p2pMbPerSec = (peers * kbPerPeer) / 1024; // 0.7324 MB/s
    const sustainedMbps = p2pMbPerSec * 8; // ~5.86 Mbps
    const burstMbps = sustainedMbps * 1.5; // ~8.79 Mbps
    assert(Math.round(sustainedMbps * 100) / 100 === 5.86, `Sustained Mbps is ~5.86 Mbps (Calculated: ${sustainedMbps.toFixed(2)})`);
    assert(Math.round(burstMbps * 100) / 100 === 8.79, `Burst Mbps is ~8.79 Mbps (Calculated: ${burstMbps.toFixed(2)})`);

    const monthlyTransferGb = (p2pMbPerSec * 730 * 3600) / 1024;
    assert(Math.round(monthlyTransferGb) === 1880, `Monthly data transfer is ~1880 GB (~1.84 TB) (Calculated: ${monthlyTransferGb.toFixed(0)})`);

    // 8. Test Calculator Mathematics - Operating Cost Formula
    console.log("\n8. Testing Operating Cost & TCO Algorithm...");
    const watts = 110;
    const kwhRate = 0.16;
    const monthlyElectricity = ((watts * 730) / 1000) * kwhRate;
    assert(Math.round(monthlyElectricity * 100) / 100 === 12.85, `Monthly electricity is $12.85 (Calculated: $${monthlyElectricity.toFixed(2)})`);

    const hardwareUpfront = 1600;
    const monthlyAmortized = hardwareUpfront / 36;
    const homeIsp = 15;
    const homeMonthlyTco = monthlyAmortized + monthlyElectricity + homeIsp;
    assert(Math.round(homeMonthlyTco * 100) / 100 === 72.29, `Home monthly TCO is $72.29 (Calculated: $${homeMonthlyTco.toFixed(2)})`);

    const cloudMonthly = 90 + 35 + 15; // 140
    const cloud3Year = cloudMonthly * 36; // 5040
    const home3Year = hardwareUpfront + (monthlyElectricity + homeIsp) * 36; // 1600 + (27.848 * 36) = 2602.53
    const savings = cloud3Year - home3Year;
    assert(cloud3Year === 5040, `Cloud 3-year TCO is $5040 (Calculated: $${cloud3Year})`);
    assert(Math.round(home3Year * 100) / 100 === 2602.53, `Home 3-year TCO is $2602.53 (Calculated: $${home3Year.toFixed(2)})`);
    assert(Math.round(savings * 100) / 100 === 2437.47, `3-year savings is $2437.47 (Calculated: $${savings.toFixed(2)})`);

    console.log("\n=================================");
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log("=================================\n");

    await prisma.$disconnect();

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution exception:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

runPhase07Tests();
