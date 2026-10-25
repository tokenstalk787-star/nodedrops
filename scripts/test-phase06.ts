import {
  getPaginatedGuides,
  getGuideBySlug,
  getGuideFilterOptions,
} from "../src/lib/repositories/guide.repository";
import { getCategoryBySlug, getAllCategories } from "../src/lib/repositories/category.repository";
import { extractTocFromMarkdown } from "../src/components/guide/GuideContentRenderer";
import { Difficulty, PublicationStatus } from "@prisma/client";

async function runPhase06Tests() {
  console.log("=== NodeDrops Phase 06 Test Suite ===");
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
    // 1. Test Paginated Guides returns published runbooks and excludes drafts
    console.log("\n1. Testing Paginated Guides Query & Draft Exclusion...");
    const paginated = await getPaginatedGuides({ status: PublicationStatus.PUBLISHED });
    assert(paginated.total >= 4, `Expected at least 4 published guides, found ${paginated.total}`);
    
    const draftFoundInList = paginated.guides.some(
      (g) => g.slug === "ethereum-mainnet-staking-draft"
    );
    assert(!draftFoundInList, "Draft guide 'ethereum-mainnet-staking-draft' is strictly excluded from public list");

    // 2. Test Difficulty and Network Filters
    console.log("\n2. Testing Filters (Difficulty, Network, Category)...");
    const intermediateGuides = await getPaginatedGuides({
      difficulty: Difficulty.INTERMEDIATE,
    });
    assert(
      intermediateGuides.total >= 2,
      `Expected at least 2 intermediate guides, found ${intermediateGuides.total}`
    );

    const holeskyGuides = await getPaginatedGuides({
      networkSlug: "holesky",
    });
    assert(
      holeskyGuides.total >= 1 && holeskyGuides.guides[0].slug === "ethereum-validator-holesky",
      "Network filter 'holesky' correctly resolved Holesky validator guide"
    );

    const filterOptions = await getGuideFilterOptions();
    assert(filterOptions.categories.length > 0, `Loaded ${filterOptions.categories.length} category filter options`);
    assert(filterOptions.networks.length > 0, `Loaded ${filterOptions.networks.length} network filter options`);

    // 3. Test Guide Detail Fetching by Slug & Relations
    console.log("\n3. Testing Guide Detail & Relations...");
    const holeskyGuide = await getGuideBySlug("ethereum-validator-holesky");
    assert(holeskyGuide !== null, "Found guide by slug 'ethereum-validator-holesky'");
    assert(holeskyGuide?.category?.slug === "validator-nodes", "Guide category relation verified");
    assert(
      (holeskyGuide?.guideNetworks?.length ?? 0) > 0,
      `Guide is linked to ${holeskyGuide?.guideNetworks.length} network(s)`
    );
    assert(
      (holeskyGuide?.guideSources?.length ?? 0) > 0,
      `Guide has ${holeskyGuide?.guideSources.length} verified upstream source(s)`
    );

    // 4. Test Draft Protection on Detail Route
    console.log("\n4. Testing Draft Protection on Detail Slug Lookup...");
    const draftDetail = await getGuideBySlug("ethereum-mainnet-staking-draft");
    assert(
      draftDetail === null,
      "Draft guide lookup returns null (triggers 404 for public visitors)"
    );

    const nonExistentDetail = await getGuideBySlug("non-existent-slug-xyz");
    assert(
      nonExistentDetail === null,
      "Non-existent guide returns null (triggers 404)"
    );

    // 5. Test Category Detail & Related Guides
    console.log("\n5. Testing Category Archives...");
    const category = await getCategoryBySlug("validator-nodes");
    assert(category !== null, "Found category by slug 'validator-nodes'");
    assert(
      category?.guides.length === 1 && category.guides[0].slug === "ethereum-validator-holesky",
      "Category contains published guide and excludes drafts"
    );

    const nonExistentCategory = await getCategoryBySlug("non-existent-category");
    assert(nonExistentCategory === null, "Non-existent category returns null (triggers 404)");

    const allCategories = await getAllCategories();
    assert(allCategories.length >= 4, `Found ${allCategories.length} categories`);

    // 6. Test TOC extraction
    console.log("\n6. Testing TOC Extraction...");
    if (holeskyGuide) {
      const toc = extractTocFromMarkdown(holeskyGuide.content);
      assert(toc.length >= 5, `Extracted ${toc.length} TOC headings from Markdown content`);
      const hasStep1 = toc.some((item) => item.id.includes("step-1"));
      assert(hasStep1, "TOC correctly includes Step 1 anchor ID");
    }

    console.log("\n=================================");
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log("=================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Test execution exception:", error);
    process.exit(1);
  }
}

runPhase06Tests();
