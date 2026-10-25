import prisma from "../src/lib/prisma";
import { submitContactAction } from "../src/lib/actions/contact.actions";
import { resetRateLimit, checkRateLimit } from "../src/lib/auth/rateLimit";
import { SubmissionStatus } from "@prisma/client";
import { FOOTER_LINKS } from "../src/lib/constants";

async function runPhase09Tests() {
  console.log("=== NodeDrops Phase 09 Public Pages & Contact Test Suite ===");
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
    // 1. Footer Links Integrity & Validation
    // -------------------------------------------------------------------------
    console.log("\n1. Testing Footer Links & Navigation Integrity...");
    const platformLinks = FOOTER_LINKS.platform;
    const requiredPlatformRoutes = ["/about", "/methodology", "/contact", "/privacy", "/terms"];

    for (const route of requiredPlatformRoutes) {
      const found = platformLinks.some((l) => l.href === route);
      assert(found, `Platform footer includes valid link to '${route}'`);
    }

    const resourceLinks = FOOTER_LINKS.resources;
    assert(resourceLinks.length >= 5, `Resource footer contains ${resourceLinks.length} calculator/tool links`);
    for (const resLink of resourceLinks) {
      assert(resLink.href.startsWith("/tools"), `Resource link '${resLink.label}' directs to active tool: ${resLink.href}`);
    }

    // -------------------------------------------------------------------------
    // 2. Contact Action - Input Validation (Invalid Email & Short Content)
    // -------------------------------------------------------------------------
    console.log("\n2. Testing Contact Action Validation...");
    const invalidForm = new FormData();
    invalidForm.append("name", "A"); // too short (< 2)
    invalidForm.append("email", "not-an-email"); // invalid email
    invalidForm.append("subject", ""); // empty
    invalidForm.append("message", "short"); // too short (< 10)

    const invalidResult = await submitContactAction(null, invalidForm);
    assert(invalidResult.success === false, "Validation rejected invalid form submission");
    assert(invalidResult.fieldErrors !== undefined, "Validation returned field-specific errors");
    assert(!!invalidResult.fieldErrors?.name, "Caught name length error");
    assert(!!invalidResult.fieldErrors?.email, "Caught email format error");
    assert(!!invalidResult.fieldErrors?.subject, "Caught subject required error");
    assert(!!invalidResult.fieldErrors?.message, "Caught message length error");

    // -------------------------------------------------------------------------
    // 3. Honeypot Anti-Spam Protection
    // -------------------------------------------------------------------------
    console.log("\n3. Testing Honeypot Bot Spam Rejection...");
    const honeypotForm = new FormData();
    honeypotForm.append("name", "Spam Bot");
    honeypotForm.append("email", "spambot@malicious-domain.com");
    honeypotForm.append("subject", "General Inquiry");
    honeypotForm.append("message", "Buy cheap tokens at my spam link right now!");
    honeypotForm.append("website", "https://spamlink.xyz"); // Bot fills hidden honeypot

    const initialDbCount = await prisma.contactSubmission.count({
      where: { email: "spambot@malicious-domain.com" },
    });

    const honeypotResult = await submitContactAction(null, honeypotForm);
    assert(honeypotResult.success === true, "Honeypot returns deceptive success to fool bot");

    const afterDbCount = await prisma.contactSubmission.count({
      where: { email: "spambot@malicious-domain.com" },
    });
    assert(afterDbCount === initialDbCount, "Honeypot submission is dropped and NOT saved to MySQL database");

    // -------------------------------------------------------------------------
    // 4. Rate Limiting on Contact Desk
    // -------------------------------------------------------------------------
    console.log("\n4. Testing Contact Desk Rate Limiting...");
    const rateLimitKey = "contact:test-rate-limit@nodedrops.xyz:127.0.0.1";
    resetRateLimit(rateLimitKey);

    // Initial check
    assert(checkRateLimit(rateLimitKey).allowed === true, "Initial contact rate limit allowed");

    // Submit 5 valid entries to hit rate limit
    for (let i = 1; i <= 5; i++) {
      const validForm = new FormData();
      validForm.append("name", "Test Operator");
      validForm.append("email", "test-rate-limit@nodedrops.xyz");
      validForm.append("subject", "Technical Errata");
      validForm.append("message", `Test message submission number ${i} for rate limiting check.`);
      await submitContactAction(null, validForm);
    }

    // 6th attempt should be blocked by rate limiter
    const blockedForm = new FormData();
    blockedForm.append("name", "Test Operator");
    blockedForm.append("email", "test-rate-limit@nodedrops.xyz");
    blockedForm.append("subject", "Technical Errata");
    blockedForm.append("message", "This 6th message should be rate-limited by sliding window.");

    const blockedResult = await submitContactAction(null, blockedForm);
    assert(blockedResult.success === false, "6th rapid submission is blocked by rate limiter");
    assert(
      Boolean(blockedResult.error?.includes("Too many submissions")),
      `Rate limit returned appropriate cooldown message: '${blockedResult.error}'`
    );

    // Clean up rate-limit test records
    await prisma.contactSubmission.deleteMany({
      where: { email: "test-rate-limit@nodedrops.xyz" },
    });
    resetRateLimit(rateLimitKey);
    console.log("  [CLEANUP] Deleted rate limit test records");

    // -------------------------------------------------------------------------
    // 5. Genuine Submission Persistence & Verification
    // -------------------------------------------------------------------------
    console.log("\n5. Testing Legitimate Contact Submission Persistence...");
    const testEmail = "operator-alpha@nodedrops-test.com";
    const testSubject = "Content Correction / Runbook Errata";
    const testMessage = "Geth v1.14.0 changed the default RPC port and requires explicit --http.api flag for debug.";

    const legitForm = new FormData();
    legitForm.append("name", "Operator Alpha");
    legitForm.append("email", testEmail);
    legitForm.append("subject", testSubject);
    legitForm.append("message", testMessage);

    const legitResult = await submitContactAction(null, legitForm);
    assert(legitResult.success === true, "Legitimate submission succeeded");
    assert(Boolean(legitResult.message?.includes("logged in our review queue")), "Success message confirms queue persistence");

    // Query database to verify persistence
    const savedRecord = await prisma.contactSubmission.findFirst({
      where: { email: testEmail },
    });

    assert(savedRecord !== null, "Contact submission successfully saved to MySQL database");
    assert(savedRecord?.name === "Operator Alpha", "Persisted name matches");
    assert(savedRecord?.subject === testSubject, "Persisted subject matches");
    assert(savedRecord?.message === testMessage, "Persisted message content matches");
    assert(savedRecord?.status === SubmissionStatus.PENDING, "Default submission status is PENDING");
    assert(typeof savedRecord?.ipAddress === "string", "IP address captured for security");

    // Clean up legitimate test record
    if (savedRecord) {
      await prisma.contactSubmission.delete({
        where: { id: savedRecord.id },
      });
      console.log("  [CLEANUP] Deleted test contact submission record");
    }

  } catch (error) {
    console.error("Test execution error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n==================================================");
  console.log(`Phase 09 Tests Completed: ${passed} passed, ${failed} failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase09Tests();
