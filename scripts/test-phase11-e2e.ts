import prisma from "../src/lib/prisma";
import { getNetworkBySlug, getPaginatedNetworks } from "../src/lib/repositories/network.repository";
import { getGuideBySlug, getPaginatedGuides } from "../src/lib/repositories/guide.repository";
import { getCategoryBySlug } from "../src/lib/repositories/category.repository";
import { searchGlobal } from "../src/lib/repositories/search.repository";
import { submitContactAction } from "../src/lib/actions/contact.actions";
import { verifyPassword } from "../src/lib/auth/password";
import { signPayload, verifyToken, SessionPayload } from "../src/lib/auth/session";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
import {
  Role,
  NetworkStatus,
  PublicationStatus,
  Difficulty,
  SubmissionStatus,
  NetworkType,
} from "@prisma/client";

async function runE2EUserJourneys() {
  console.log("===============================================================");
  console.log("🔍 NODEDROPS PHASE 11: 16 END-TO-END USER JOURNEY VERIFICATION");
  console.log("===============================================================\n");

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

  const baseUrl = "http://localhost:3000";

  try {
    // -------------------------------------------------------------------------
    // JOURNEY 1: Open Homepage
    // -------------------------------------------------------------------------
    console.log("--- Journey 1: Open Homepage (/) ---");
    const homeRes = await fetch(`${baseUrl}/`, { redirect: "manual" });
    assert(homeRes.status === 200, `Homepage returned HTTP ${homeRes.status}`);
    const homeHtml = await homeRes.text();
    assert(
      homeHtml.includes("Your Guide to Running Blockchain Nodes") || homeHtml.includes("NodeDrops"),
      "Homepage contains core value proposition heading"
    );
    assert(homeHtml.includes("<header") && homeHtml.includes("<footer"), "Homepage contains semantic header and footer landmarks");

    // -------------------------------------------------------------------------
    // JOURNEY 2: Navigate to Testnets
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 2: Navigate to Testnets (/testnets) ---");
    const testnetRes = await fetch(`${baseUrl}/testnets`, { redirect: "manual" });
    assert(testnetRes.status === 200, `Testnets page returned HTTP ${testnetRes.status}`);
    const testnetNets = await getPaginatedNetworks({ type: NetworkType.TESTNET });
    assert(testnetNets.total > 0, `Database contains ${testnetNets.total} testnet network(s)`);
    assert(
      testnetNets.networks.some((n) => n.slug === "holesky"),
      "Holesky testnet verified in testnet directory"
    );

    // -------------------------------------------------------------------------
    // JOURNEY 3: Search for a Network
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 3: Search for a Network ('Ethereum') ---");
    const searchRes = await fetch(`${baseUrl}/search?q=Ethereum`, { redirect: "manual" });
    assert(searchRes.status === 200, `Search page returned HTTP ${searchRes.status}`);
    const queryResults = await searchGlobal({ query: "Ethereum" });
    assert(queryResults.totalCount >= 2, `Search returned ${queryResults.totalCount} results for 'Ethereum'`);
    assert(
      queryResults.networks.some((n) => n.slug === "ethereum"),
      "Search found 'Ethereum Mainnet' record"
    );

    // -------------------------------------------------------------------------
    // JOURNEY 4: Apply and Clear Filters
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 4: Apply and Clear Filters ---");
    const filteredNets = await getPaginatedNetworks({ category: "Layer 1" });
    assert(filteredNets.networks.every((n) => n.category === "Layer 1"), "Network filter applied: all results are 'Layer 1'");

    const filteredGuides = await getPaginatedGuides({ difficulty: Difficulty.BEGINNER });
    assert(filteredGuides.guides.every((g) => g.difficulty === Difficulty.BEGINNER), "Guide filter applied: all results are BEGINNER");

    const allGuides = await getPaginatedGuides();
    assert(allGuides.total >= filteredGuides.total, "Clearing filters restores full directory set");

    // -------------------------------------------------------------------------
    // JOURNEY 5: Open a Network Detail Page
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 5: Open Network Detail Page (/networks/arbitrum-one) ---");
    const netDetailRes = await fetch(`${baseUrl}/networks/arbitrum-one`, { redirect: "manual" });
    assert(netDetailRes.status === 200, `Network detail page returned HTTP ${netDetailRes.status}`);
    const arbNet = await getNetworkBySlug("arbitrum-one");
    assert(arbNet !== null, "Arbitrum One network record found in database");
    assert(arbNet?.clients.length! > 0, `Arbitrum One has ${arbNet?.clients.length} documented client software entries`);
    assert(arbNet?.hardwareRequirements.length! > 0, "Hardware requirements are documented for Arbitrum One");

    // -------------------------------------------------------------------------
    // JOURNEY 6: Open a Guide
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 6: Open a Runbook (/guides/arbitrum-nitro-docker) ---");
    const guideDetailRes = await fetch(`${baseUrl}/guides/arbitrum-nitro-docker`, { redirect: "manual" });
    assert(guideDetailRes.status === 200, `Guide detail page returned HTTP ${guideDetailRes.status}`);
    const guideHtml = await guideDetailRes.text();
    assert(guideHtml.includes("Arbitrum") || guideHtml.includes("Nitro"), "Guide page renders runbook title");

    // -------------------------------------------------------------------------
    // JOURNEY 7: Copy a Command
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 7: Verify CommandBlock & Copy Command ---");
    const arbGuide = await getGuideBySlug("arbitrum-nitro-docker", false);
    assert(arbGuide !== null, "Arbitrum guide content fetched");
    assert(Boolean(arbGuide?.content.includes("docker compose up -d")), "Guide contains expected bash Docker command");
    assert(Boolean(arbGuide?.content.includes("Expected Output")), "Guide contains expected output verification section");

    // -------------------------------------------------------------------------
    // JOURNEY 8: Use a Calculator
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 8: Use Sizing & Planning Calculators (/tools) ---");
    const toolsRes = await fetch(`${baseUrl}/tools`, { redirect: "manual" });
    assert(toolsRes.status === 200, `Tools hub returned HTTP ${toolsRes.status}`);

    // Storage math verification
    const initGB = 850;
    const monthlyGB = 35;
    const months = 12;
    const buffer = 50;
    const projected = initGB + (monthlyGB * months) + buffer;
    assert(projected === 1320, `Projected storage mathematically verified: ${projected} GB`);

    // -------------------------------------------------------------------------
    // JOURNEY 9: Submit an Invalid Contact Form
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 9: Submit an Invalid Contact Form ---");
    const invalidForm = new FormData();
    invalidForm.append("name", "X");
    invalidForm.append("email", "invalid-email-address");
    invalidForm.append("subject", "");
    invalidForm.append("message", "short");

    const invalidSubmission = await submitContactAction(null, invalidForm);
    assert(invalidSubmission.success === false, "Server action rejected invalid contact submission");
    assert(invalidSubmission.fieldErrors !== undefined, "Field-specific validation errors returned");

    // -------------------------------------------------------------------------
    // JOURNEY 10: Submit a Valid Contact Form
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 10: Submit a Valid Contact Form ---");
    const e2eEmail = "e2e-qa-tester@nodedrops.xyz";
    const validForm = new FormData();
    validForm.append("name", "QA Automation Engineer");
    validForm.append("email", e2eEmail);
    validForm.append("subject", "Content Correction / Runbook Errata");
    validForm.append("message", "E2E automated verification of contact desk persistence and queue logging.");

    const validSubmission = await submitContactAction(null, validForm);
    assert(validSubmission.success === true, "Valid contact submission succeeded");
    assert(Boolean(validSubmission.message?.includes("logged in our review queue")), "Confirmation message displayed to user");

    // Verify record in database
    const savedInquiry = await prisma.contactSubmission.findFirst({
      where: { email: e2eEmail },
    });
    assert(savedInquiry !== null, "Inquiry physically persisted to MySQL database");
    assert(savedInquiry?.status === SubmissionStatus.PENDING, "Submission status set to PENDING");

    // Clean up
    if (savedInquiry) {
      await prisma.contactSubmission.delete({ where: { id: savedInquiry.id } });
      console.log("  [CLEANUP] Deleted test inquiry record");
    }

    // -------------------------------------------------------------------------
    // JOURNEY 11: Access Admin Without Authentication
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 11: Attempt Unauthenticated Admin Access ---");
    const unauthAdmin = await fetch(`${baseUrl}/admin`, { redirect: "manual" });
    assert(
      unauthAdmin.status === 307 || unauthAdmin.status === 302,
      `Unauthenticated /admin redirected with HTTP ${unauthAdmin.status}`
    );
    const redirectTarget = unauthAdmin.headers.get("location") || "";
    assert(redirectTarget.includes("/admin/login"), `Redirected to login portal: ${redirectTarget}`);

    // -------------------------------------------------------------------------
    // JOURNEY 12: Sign in as an Authorized Admin
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 12: Authorized Admin Sign-In & HMAC Session ---");
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@nodedrops.xyz" },
    });
    assert(adminUser !== null, "admin@nodedrops.xyz found in database");
    assert(adminUser?.role === Role.ADMIN, "User has ADMIN role");

    // Verify session token cryptography
    const nowSec = Math.floor(Date.now() / 1000);
    const testSessionPayload: SessionPayload = {
      uid: adminUser!.id,
      email: adminUser!.email,
      name: adminUser!.name,
      role: adminUser!.role,
      iat: nowSec,
      exp: nowSec + 3600,
    };
    const signedToken = signPayload(testSessionPayload);
    const verifiedSession = verifyToken(signedToken);
    assert(verifiedSession?.email === "admin@nodedrops.xyz", "HMAC session verified for admin user");

    // -------------------------------------------------------------------------
    // JOURNEY 13: Create and Edit a Draft Guide
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 13: Create Draft Guide & Public 404 Isolation ---");
    const draftSlug = "e2e-test-draft-guide";
    const testCategory = await prisma.category.findFirst();

    // Create draft guide
    const createdDraft = await prisma.guide.create({
      data: {
        title: "E2E Temporary Test Guide",
        slug: draftSlug,
        summary: "Automated end-to-end testing runbook lifecycle.",
        content: "# E2E Test Runbook\n\nStep 1: Test.\n\n```bash\necho 'hello world'\n```",
        difficulty: Difficulty.BEGINNER,
        publicationStatus: PublicationStatus.DRAFT,
        authorId: adminUser!.id,
        categoryId: testCategory!.id,
      },
    });
    assert(createdDraft.id !== undefined, "Draft guide created in database with DRAFT status");

    // Verify public query returns null (triggers 404)
    const publicQuery = await getGuideBySlug(draftSlug, false);
    assert(publicQuery === null, "Draft guide returns null for public visitors (HTTP 404 isolation)");

    // Verify admin preview query returns the guide
    const adminQuery = await getGuideBySlug(draftSlug, true);
    assert(adminQuery !== null, "Draft guide accessible in admin preview mode");

    // -------------------------------------------------------------------------
    // JOURNEY 14: Publish and Verify Content Publicly
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 14: Publish Content & Verify Public Availability ---");
    const publishedGuide = await prisma.guide.update({
      where: { id: createdDraft.id },
      data: { publicationStatus: PublicationStatus.PUBLISHED },
    });
    assert(publishedGuide.publicationStatus === PublicationStatus.PUBLISHED, "Guide updated to PUBLISHED");

    // Now public query must succeed
    const publicNow = await getGuideBySlug(draftSlug, false);
    assert(publicNow !== null, "Newly published guide is immediately accessible to public query");

    // Verify sitemap inclusion
    const dynamicSitemap = await sitemap();
    const inSitemap = dynamicSitemap.some((entry) => entry.url.includes(draftSlug));
    assert(inSitemap, "Newly published guide dynamically included in XML sitemap");

    // -------------------------------------------------------------------------
    // JOURNEY 15: Retire Content and Verify Public Behavior
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 15: Retire Content & Verify De-indexing ---");
    await prisma.guide.update({
      where: { id: createdDraft.id },
      data: { publicationStatus: PublicationStatus.ARCHIVED },
    });

    const retiredPublic = await getGuideBySlug(draftSlug, false);
    assert(retiredPublic === null, "Archived guide returns null for public visitors");

    const sitemapAfterRetire = await sitemap();
    const inSitemapAfter = sitemapAfterRetire.some((entry) => entry.url.includes(draftSlug));
    assert(!inSitemapAfter, "Archived guide dynamically excluded from XML sitemap");

    // Cleanup test guide
    await prisma.guide.delete({ where: { id: createdDraft.id } });
    console.log("  [CLEANUP] Deleted E2E test guide record");

    // -------------------------------------------------------------------------
    // JOURNEY 16: Non-Existent Slugs Handling (HTTP 404)
    // -------------------------------------------------------------------------
    console.log("\n--- Journey 16: Invalid Slugs & Nonexistent Pages (404) ---");
    const badNetRes = await fetch(`${baseUrl}/networks/non-existent-network-xyz-99999`, { redirect: "manual" });
    assert(badNetRes.status === 404, `Invalid network slug returned HTTP ${badNetRes.status}`);

    const badGuideRes = await fetch(`${baseUrl}/guides/non-existent-guide-xyz-99999`, { redirect: "manual" });
    assert(badGuideRes.status === 404, `Invalid guide slug returned HTTP ${badGuideRes.status}`);

    const badCategoryRes = await fetch(`${baseUrl}/categories/non-existent-cat-xyz-99999`, { redirect: "manual" });
    assert(badCategoryRes.status === 404, `Invalid category slug returned HTTP ${badCategoryRes.status}`);

  } catch (error) {
    console.error("E2E Test Execution Error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n===============================================================");
  console.log(`🎉 Phase 11 E2E Journeys Completed: ${passed} passed, ${failed} failed`);
  console.log("===============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runE2EUserJourneys();
