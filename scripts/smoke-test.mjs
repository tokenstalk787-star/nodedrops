const baseUrl = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000"
).replace(/\/+$/, "");

let passed = 0;
let failed = 0;

async function check(name, run) {
  try {
    await run();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function request(path) {
  return fetch(new URL(path, baseUrl), {
    headers: { Accept: "application/json, text/html;q=0.9, */*;q=0.8" },
    redirect: "follow",
  });
}

async function expectStatus(path, expectedStatus) {
  const response = await request(path);
  if (response.status !== expectedStatus) {
    throw new Error(`expected HTTP ${expectedStatus}, received ${response.status}`);
  }
  return response;
}

await check("health endpoint responds and database is connected", async () => {
  const response = await expectStatus("/api/health", 200);
  const body = await response.json();
  if (body.status !== "ok" || body.database !== "connected") {
    throw new Error(`unexpected health payload: ${JSON.stringify(body)}`);
  }
});

let firstSlug = null;

await check("opportunity API returns paginated JSON", async () => {
  const response = await expectStatus("/api/opportunities?page=1&limit=12", 200);
  const body = await response.json();
  if (!Array.isArray(body.data) || !body.pagination) {
    throw new Error("response must include data[] and pagination");
  }
  if (!Number.isInteger(body.pagination.total) || body.pagination.total < 0) {
    throw new Error("pagination.total must be a non-negative integer");
  }
  if (body.data.some((item) => item.isDemo === true || item.slug === "example-testnet")) {
    throw new Error("public results must not include demo or legacy example listings");
  }
  firstSlug = body.data[0]?.slug ?? null;
});

await check("category filter only returns matching listings", async () => {
  const response = await expectStatus("/api/opportunities?category=Node&limit=50", 200);
  const body = await response.json();
  if (!Array.isArray(body.data) || body.data.some((item) => item.category !== "Node")) {
    throw new Error("category filter returned a non-matching listing");
  }
});

await check("invalid status filter is rejected", async () => {
  await expectStatus("/api/opportunities?status=NOT_A_STATUS", 400);
});

await check("incentive status filter only returns matching listings", async () => {
  const response = await expectStatus(
    "/api/opportunities?incentiveStatus=POTENTIAL&limit=50",
    200,
  );
  const body = await response.json();
  if (
    !Array.isArray(body.data) ||
    body.data.some((item) => item.incentiveStatus !== "POTENTIAL")
  ) {
    throw new Error("incentive status filter returned a non-matching listing");
  }
});

await check("invalid incentive status is rejected", async () => {
  await expectStatus("/api/opportunities?incentiveStatus=NOT_A_STATUS", 400);
});

await check("opportunity status filter only returns matching listings", async () => {
  const response = await expectStatus(
    "/api/opportunities?status=ACTIVE&limit=50",
    200,
  );
  const body = await response.json();
  if (
    !Array.isArray(body.data) ||
    body.data.some((item) => item.status !== "ACTIVE")
  ) {
    throw new Error("opportunity status filter returned a non-matching listing");
  }
});

await check("explicitly disabling demo records keeps them out of public results", async () => {
  const response = await expectStatus(
    "/api/opportunities?includeDemo=false&limit=50",
    200,
  );
  const body = await response.json();
  if (
    !Array.isArray(body.data) ||
    body.data.some((item) => item.isDemo === true || item.slug === "example-testnet")
  ) {
    throw new Error("demo or legacy listing leaked into public results");
  }
});

await check("invalid includeDemo value is rejected", async () => {
  await expectStatus("/api/opportunities?includeDemo=yes", 400);
});

await check("invalid pagination is rejected", async () => {
  await expectStatus("/api/opportunities?page=0", 400);
});

await check("oversized search query is rejected", async () => {
  const query = "x".repeat(101);
  await expectStatus(`/api/opportunities?q=${query}`, 400);
});

await check("oversized category filter is rejected", async () => {
  const category = "x".repeat(81);
  await expectStatus(`/api/opportunities?category=${category}`, 400);
});

await check("unreasonably large page number is rejected", async () => {
  await expectStatus("/api/opportunities?page=9007199254740991", 400);
});

await check("API caps excessive page size", async () => {
  const response = await expectStatus("/api/opportunities?page=1&limit=999", 200);
  const body = await response.json();
  if (body.pagination?.limit !== 50 || body.data.length > 50) {
    throw new Error("API did not enforce the maximum page size of 50");
  }
});

await check("homepage responds with NodeDrops content", async () => {
  const response = await expectStatus("/", 200);
  const html = await response.text();
  if (!html.toLowerCase().includes("nodedrops") || !html.includes("<h1")) {
    throw new Error("homepage is missing expected brand or primary heading");
  }
});

await check("about page responds with page-specific content", async () => {
  const response = await expectStatus("/about", 200);
  const html = await response.text();
  if (!html.includes("Discover opportunities in Web3.") || !html.includes('rel="canonical"')) {
    throw new Error("about page is missing its heading or canonical URL");
  }
});

await check("FAQ page responds with safety guidance", async () => {
  const response = await expectStatus("/faq", 200);
  const html = await response.text();
  if (!html.includes("seed phrase") || !html.includes('rel="canonical"')) {
    throw new Error("FAQ page is missing wallet safety guidance or canonical URL");
  }
});

await check("methodology page responds with verification guidance", async () => {
  const response = await expectStatus("/methodology", 200);
  const html = await response.text();
  if (!html.includes("verification methodology") || !html.includes('rel="canonical"')) {
    throw new Error("methodology page is missing verification content or canonical URL");
  }
});

await check("homepage includes baseline browser security headers", async () => {
  const response = await expectStatus("/", 200);
  const expectedHeaders = [
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "DENY"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
  ];

  for (const [name, expected] of expectedHeaders) {
    if (response.headers.get(name)?.toLowerCase() !== expected.toLowerCase()) {
      throw new Error(`missing or incorrect ${name} security header`);
    }
  }
});

await check("robots.txt blocks API crawling", async () => {
  const response = await expectStatus("/robots.txt", 200);
  const body = await response.text();
  if (!body.includes("Disallow: /api/") || !body.includes("Sitemap:")) {
    throw new Error("robots.txt must disallow API routes and reference the sitemap");
  }
});

await check("opportunity directory page responds", async () => {
  await expectStatus("/opportunities", 200);
});

await check("sitemap responds with XML", async () => {
  const response = await expectStatus("/sitemap.xml", 200);
  const xml = await response.text();
  const expectedCanonical = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nodedrops.xyz"
  ).replace(/\/+$/, "");
  if (!xml.includes("<urlset") || !xml.includes(expectedCanonical)) {
    throw new Error("sitemap XML is missing the expected URL set or canonical site");
  }
});

await check("unknown opportunity API slug returns 404", async () => {
  await expectStatus("/api/opportunities/nodedrops-smoke-test-missing-slug", 404);
});

await check("invalid opportunity API slug is rejected without caching the error", async () => {
  const response = await expectStatus("/api/opportunities/INVALID_SLUG", 400);
  if (response.headers.get("cache-control") !== "no-store") {
    throw new Error("invalid-slug error response must use Cache-Control: no-store");
  }
});

await check("opportunity write endpoint rejects unauthenticated requests", async () => {
  const response = await fetch(new URL("/api/opportunities", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (response.status !== 401) {
    throw new Error(`expected HTTP 401, received ${response.status}`);
  }
});

await check("first listed opportunity detail responds with page-specific SEO", async () => {
  if (!firstSlug) {
    throw new Error("no public opportunity is available to test");
  }
  await expectStatus(`/api/opportunities/${encodeURIComponent(firstSlug)}`, 200);
  const response = await expectStatus(
    `/opportunities/${encodeURIComponent(firstSlug)}`,
    200,
  );
  const html = await response.text();
  if (!html.includes('rel="canonical"') || !html.includes("/opportunities/")) {
    throw new Error("opportunity page is missing its canonical detail URL");
  }
});

const isProductionHost = !/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(
  new URL(baseUrl).host,
);

if (isProductionHost) {
  await check("production API refuses demo records", async () => {
    await expectStatus("/api/opportunities?includeDemo=true", 400);
  });
}

console.log(`\nSmoke test result: ${passed} passed, ${failed} failed. Target: ${baseUrl}`);
if (failed > 0) process.exitCode = 1;
