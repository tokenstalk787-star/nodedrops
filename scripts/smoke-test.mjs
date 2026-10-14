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

await check("invalid opportunity API slug is rejected", async () => {
  await expectStatus("/api/opportunities/INVALID_SLUG", 400);
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
