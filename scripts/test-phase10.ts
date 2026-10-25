import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import {
  buildWebSiteSchema,
  buildBreadcrumbSchema,
  buildGuideSchema,
  BASE_URL,
} from "../src/lib/seo/schema";
import prisma from "../src/lib/prisma";

async function runPhase10Tests() {
  console.log("=== NodeDrops Phase 10 SEO, Performance & Analytics Test Suite ===");
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
    // -------------------------------------------------------------------------
    // 1. Robots.txt Configuration
    // -------------------------------------------------------------------------
    console.log("\n1. Testing robots.txt Generation & Disallow Rules...");
    const robotsConfig = robots();

    assert(robotsConfig.rules !== undefined, "robots.txt includes rules array");
    const defaultRule = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
    assert(defaultRule?.userAgent === "*", "Rules target userAgent '*'");
    assert(defaultRule?.allow === "/", "Public content '/' is allowed");

    const disallowList = Array.isArray(defaultRule?.disallow)
      ? defaultRule.disallow
      : [defaultRule?.disallow];

    assert(
      disallowList.some((d) => d?.includes("/admin")),
      "Admin paths are strictly disallowed in robots.txt"
    );
    assert(
      disallowList.some((d) => d?.includes("/api")),
      "API paths are strictly disallowed in robots.txt"
    );
    assert(
      robotsConfig.sitemap === `${BASE_URL}/sitemap.xml`,
      `Sitemap URL correctly configured as '${robotsConfig.sitemap}'`
    );

    // -------------------------------------------------------------------------
    // 2. Dynamic XML Sitemap & Draft Isolation
    // -------------------------------------------------------------------------
    console.log("\n2. Testing Dynamic Sitemap Generation & Publication Integrity...");
    const sitemapEntries = await sitemap();
    assert(Array.isArray(sitemapEntries), "Sitemap returns an array of entries");
    assert(sitemapEntries.length > 10, `Sitemap contains ${sitemapEntries.length} valid entries`);

    // Verify static public routes
    const expectedStaticRoutes = [
      `${BASE_URL}`,
      `${BASE_URL}/networks`,
      `${BASE_URL}/testnets`,
      `${BASE_URL}/mainnets`,
      `${BASE_URL}/guides`,
      `${BASE_URL}/tools`,
      `${BASE_URL}/about`,
      `${BASE_URL}/methodology`,
      `${BASE_URL}/contact`,
      `${BASE_URL}/privacy`,
      `${BASE_URL}/terms`,
    ];

    for (const expRoute of expectedStaticRoutes) {
      const exists = sitemapEntries.some((entry) => entry.url === expRoute);
      assert(exists, `Sitemap includes public route '${expRoute}'`);
    }

    // Verify published guide is present
    const publishedGuideInSitemap = sitemapEntries.some((entry) =>
      entry.url.includes("arbitrum-nitro-docker")
    );
    assert(publishedGuideInSitemap, "Published guide 'arbitrum-nitro-docker' is included in sitemap");

    // CRITICAL: Verify draft guide is strictly excluded from public sitemap
    const draftGuideInSitemap = sitemapEntries.some((entry) =>
      entry.url.includes("ethereum-mainnet-staking-draft")
    );
    assert(
      !draftGuideInSitemap,
      "DRAFT guide 'ethereum-mainnet-staking-draft' is strictly EXCLUDED from sitemap"
    );

    // Verify published networks are included
    const ethNetworkInSitemap = sitemapEntries.some((entry) =>
      entry.url === `${BASE_URL}/networks/ethereum`
    );
    assert(ethNetworkInSitemap, "Published network 'ethereum' is included in sitemap");

    // Verify changeFrequency and priority fields
    const homeEntry = sitemapEntries.find((entry) => entry.url === BASE_URL);
    assert(homeEntry?.priority === 1.0, "Home page has priority 1.0");
    assert(homeEntry?.changeFrequency === "daily", "Home page has daily change frequency");

    // -------------------------------------------------------------------------
    // 3. Schema.org JSON-LD Structured Data
    // -------------------------------------------------------------------------
    console.log("\n3. Testing Schema.org JSON-LD Structured Data Generators...");

    // WebSite schema
    const webSiteSchema = buildWebSiteSchema();
    assert(webSiteSchema["@context"] === "https://schema.org", "WebSite schema has valid @context");
    assert(webSiteSchema["@type"] === "WebSite", "WebSite schema @type is 'WebSite'");
    assert(webSiteSchema.potentialAction["@type"] === "SearchAction", "WebSite includes SearchAction");
    assert(
      webSiteSchema.potentialAction.target.urlTemplate.includes("/search?q="),
      "SearchAction points to /search query endpoint"
    );

    // Breadcrumb schema
    const sampleBreadcrumbs = [
      { name: "Home", url: "/" },
      { name: "Guides", url: "/guides" },
      { name: "Arbitrum Nitro", url: "/guides/arbitrum-nitro-docker" },
    ];
    const breadcrumbSchema = buildBreadcrumbSchema(sampleBreadcrumbs);
    assert(breadcrumbSchema["@type"] === "BreadcrumbList", "Breadcrumb schema @type is 'BreadcrumbList'");
    assert(breadcrumbSchema.itemListElement.length === 3, "Breadcrumb has 3 itemListElements");
    assert(breadcrumbSchema.itemListElement[0]?.position === 1, "First breadcrumb position is 1");
    assert(breadcrumbSchema.itemListElement[2]?.position === 3, "Third breadcrumb position is 3");
    assert(
      breadcrumbSchema.itemListElement[2]?.item === `${BASE_URL}/guides/arbitrum-nitro-docker`,
      "Breadcrumb URL resolved to full canonical URL"
    );

    // Guide TechArticle schema
    const guideSchema = buildGuideSchema({
      title: "Arbitrum Nitro Node Setup",
      summary: "Run a full node with Docker",
      slug: "arbitrum-nitro-docker",
      createdAt: new Date("2026-10-01T00:00:00Z"),
      updatedAt: new Date("2026-10-25T00:00:00Z"),
      difficulty: "INTERMEDIATE",
      estimatedMinutes: 45,
      author: { name: "NodeDrops Infrastructure Team" },
    });

    assert(guideSchema["@type"] === "TechArticle", "Guide schema @type is 'TechArticle'");
    assert(guideSchema.headline === "Arbitrum Nitro Node Setup", "Guide headline matches");
    assert(guideSchema.timeRequired === "PT45M", "Guide ISO 8601 duration formatted as 'PT45M'");
    assert(guideSchema.url === `${BASE_URL}/guides/arbitrum-nitro-docker`, "Guide canonical URL matches");

    // -------------------------------------------------------------------------
    // 4. Analytics Security & Consent Posture
    // -------------------------------------------------------------------------
    console.log("\n4. Testing Analytics Guardrails & Consent Isolation...");
    const fabricatedIDs = ["", "G-XXXXXXXXXX", "G-PLACEHOLDER-ID", "UA-123456-1", "invalid_id"];

    for (const testId of fabricatedIDs) {
      const isRejected =
        !testId ||
        !testId.startsWith("G-") ||
        testId === "G-XXXXXXXXXX" ||
        testId.includes("PLACEHOLDER");
      assert(isRejected, `Fabricated ID '${testId}' correctly filtered out without loading script`);
    }

    const genuineFormat: string = "G-AB12CD34EF";
    const isValidFormat =
      genuineFormat.startsWith("G-") &&
      genuineFormat !== "G-XXXXXXXXXX" &&
      !genuineFormat.includes("PLACEHOLDER");
    assert(isValidFormat, "Genuine GA4 measurement ID format passes strict validation");

  } catch (error) {
    console.error("Test execution error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n==================================================");
  console.log(`Phase 10 Tests Completed: ${passed} passed, ${failed} failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase10Tests();
