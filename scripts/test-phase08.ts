import prisma from "../src/lib/prisma";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "../src/lib/auth/rateLimit";
import { signPayload, verifyToken, SessionPayload, requireAdminAction } from "../src/lib/auth/session";
import { getGuideBySlug } from "../src/lib/repositories/guide.repository";
import { createAuditLog, getRecentAuditLogs } from "../src/lib/repositories/audit.repository";
import { Role, NetworkStatus, PublicationStatus } from "@prisma/client";

async function runPhase08Tests() {
  console.log("=== NodeDrops Phase 08 Admin CMS & Auth Test Suite ===");
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
    // 1. Password Hashing & Constant-Time Scrypt Verification
    // -------------------------------------------------------------------------
    console.log("\n1. Testing Password Hashing & Verification (scrypt + salt)...");
    const plaintext = "SecureAdminTestPassword#2026";
    const hashed = await hashPassword(plaintext);

    assert(typeof hashed === "string", "hashPassword returns a string");
    assert(hashed.includes(":"), "Hash format is 'salt:derivedKey'");

    const [salt, key] = hashed.split(":");
    assert(salt.length === 32, "Salt is a 16-byte hex string (32 characters)");
    assert(key.length === 128, "Key is a 64-byte hex string (128 characters)");

    const isValid = await verifyPassword(plaintext, hashed);
    assert(isValid === true, "verifyPassword validates correct plaintext password");

    const isInvalid = await verifyPassword("IncorrectPassword!999", hashed);
    assert(isInvalid === false, "verifyPassword rejects incorrect password");

    const malformedRejected1 = await verifyPassword(plaintext, "malformed-hash-string");
    assert(malformedRejected1 === false, "verifyPassword safely handles malformed hash strings");

    const malformedRejected2 = await verifyPassword(plaintext, "");
    assert(malformedRejected2 === false, "verifyPassword safely handles empty string hash");

    // -------------------------------------------------------------------------
    // 2. Sliding Rate Limiter
    // -------------------------------------------------------------------------
    console.log("\n2. Testing In-Memory Rate Limiting (5 attempts / 15m lockout)...");
    const testKey = "rate-limit-test-user@nodedrops.xyz";
    resetRateLimit(testKey);

    const initialCheck = checkRateLimit(testKey);
    assert(initialCheck.allowed === true, "Initial check is allowed");

    // Record 4 failed attempts
    for (let i = 1; i <= 4; i++) {
      recordFailedAttempt(testKey);
    }
    const fourthCheck = checkRateLimit(testKey);
    assert(fourthCheck.allowed === true, "4 failed attempts still within allowed threshold");

    // 5th failed attempt should trigger lockout
    recordFailedAttempt(testKey);
    const lockedCheck = checkRateLimit(testKey);
    assert(lockedCheck.allowed === false, "5th failed attempt locks out user");
    assert(
      typeof lockedCheck.remainingSeconds === "number" && lockedCheck.remainingSeconds > 0,
      `Lockout active with ${lockedCheck.remainingSeconds}s remaining`
    );

    // Reset rate limiter
    resetRateLimit(testKey);
    const postResetCheck = checkRateLimit(testKey);
    assert(postResetCheck.allowed === true, "resetRateLimit clears lockout immediately upon success");

    // -------------------------------------------------------------------------
    // 3. Cryptographic Session Signing & HMAC Validation
    // -------------------------------------------------------------------------
    console.log("\n3. Testing Session Signing & HMAC Tamper Resistance...");
    const nowSec = Math.floor(Date.now() / 1000);
    const validPayload: SessionPayload = {
      uid: "user_test_uuid_123",
      email: "admin@nodedrops.xyz",
      name: "NodeDrops Admin",
      role: Role.ADMIN,
      iat: nowSec,
      exp: nowSec + 3600, // 1 hour validity
    };

    const token = signPayload(validPayload);
    assert(typeof token === "string" && token.includes("."), "Signed session token contains payload.signature");

    const verified = verifyToken(token);
    assert(verified !== null, "verifyToken successfully decodes valid session");
    assert(verified?.email === validPayload.email, "Verified session matches user email");
    assert(verified?.role === Role.ADMIN, "Verified session matches ADMIN role");

    // Tampering test: Modifying payload without valid signature
    const [payloadB64, validSig] = token.split(".");
    const tamperedObj = { ...validPayload, role: "SUPER_ROOT" };
    const tamperedPayloadB64 = Buffer.from(JSON.stringify(tamperedObj)).toString("base64url");
    const tamperedToken = `${tamperedPayloadB64}.${validSig}`;
    const tamperedResult = verifyToken(tamperedToken);
    assert(tamperedResult === null, "verifyToken rejects payload tampering (HMAC mismatch)");

    // Forged signature test
    const forgedToken = `${payloadB64}.forged_fake_signature_hex_12345`;
    const forgedResult = verifyToken(forgedToken);
    assert(forgedResult === null, "verifyToken rejects invalid signatures");

    // Expired token test
    const expiredPayload: SessionPayload = {
      ...validPayload,
      iat: nowSec - 7200,
      exp: nowSec - 3600, // expired 1 hour ago
    };
    const expiredToken = signPayload(expiredPayload);
    const expiredResult = verifyToken(expiredToken);
    assert(expiredResult === null, "verifyToken rejects expired session tokens");

    // -------------------------------------------------------------------------
    // 4. Draft Guide Protection vs Admin Preview Mode
    // -------------------------------------------------------------------------
    console.log("\n4. Testing Draft Guide Access Control & Preview Mode...");
    const draftSlug = "ethereum-mainnet-staking-draft";

    // Public query: allowDrafts = false
    const publicView = await getGuideBySlug(draftSlug, false);
    assert(publicView === null, "Draft guide returns null for unauthenticated public visitor");

    // Admin preview: allowDrafts = true
    const adminView = await getGuideBySlug(draftSlug, true);
    assert(adminView !== null, "Draft guide retrieved successfully in admin preview mode");
    assert(
      adminView?.publicationStatus === PublicationStatus.DRAFT,
      `Retrieved guide publicationStatus is correctly ${adminView?.publicationStatus}`
    );

    // Published guide should be accessible to both
    const publishedGuide = await getGuideBySlug("arbitrum-nitro-docker", false);
    assert(publishedGuide !== null, "Published guide 'arbitrum-nitro-docker' accessible to public");

    // -------------------------------------------------------------------------
    // 5. Server-Side Guard Authorization
    // -------------------------------------------------------------------------
    console.log("\n5. Testing Server-Side Guard Enforcement...");
    let caughtUnauthorized = false;
    try {
      // In standalone script execution outside request context, requireAdminAction should throw
      await requireAdminAction();
    } catch (err: unknown) {
      caughtUnauthorized = true;
      const errorMsg = err instanceof Error ? err.message : String(err);
      assert(
        errorMsg.includes("Unauthorized"),
        `requireAdminAction threw expected authorization guard error: '${errorMsg}'`
      );
    }
    assert(caughtUnauthorized === true, "requireAdminAction blocks unauthenticated execution");

    // -------------------------------------------------------------------------
    // 6. Administrative Audit Logging & Database Mutation
    // -------------------------------------------------------------------------
    console.log("\n6. Testing Admin Database Operations & Audit Trail...");
    // Find active administrator
    const adminUser = await prisma.user.findFirst({
      where: { role: Role.ADMIN, isActive: true },
    });
    assert(adminUser !== null, `Found active administrator user: ${adminUser?.email}`);

    if (adminUser) {
      // Create a test audit log
      const auditLog = await createAuditLog({
        userId: adminUser.id,
        action: "TEST_CMS_MUTATION",
        entityType: "Guide",
        entityId: draftSlug,
        metadata: { testRunner: "Phase08TestSuite", timestamp: new Date().toISOString() },
      });

      assert(auditLog.id !== undefined, "Audit log successfully persisted to MySQL");
      assert(auditLog.action === "TEST_CMS_MUTATION", "Audit log action matches");
      assert(auditLog.userId === adminUser.id, "Audit log userId matches administrator");

      // Verify log is retrievable via getRecentAuditLogs
      const recentLogs = await getRecentAuditLogs(10);
      assert(recentLogs.length > 0, `Retrieved ${recentLogs.length} recent audit logs`);
      const foundTestLog = recentLogs.some((l) => l.action === "TEST_CMS_MUTATION");
      assert(foundTestLog === true, "Newly created test audit log appears in CMS audit trail");

      // Clean up test audit log
      await prisma.auditLog.delete({
        where: { id: auditLog.id },
      });
      console.log("  [CLEANUP] Deleted test audit log record");
    }

    // -------------------------------------------------------------------------
    // 7. Verify Seeded Admin Credentials
    // -------------------------------------------------------------------------
    console.log("\n7. Verifying Provisioned Admin User in Database...");
    const targetAdmin = await prisma.user.findUnique({
      where: { email: "admin@nodedrops.xyz" },
    });
    assert(targetAdmin !== null, "admin@nodedrops.xyz exists in database");
    assert(targetAdmin?.role === Role.ADMIN, "admin@nodedrops.xyz has role ADMIN");
    assert(targetAdmin?.isActive === true, "admin@nodedrops.xyz account is ACTIVE");
    assert(
      typeof targetAdmin?.passwordHash === "string" && targetAdmin.passwordHash.includes(":"),
      "admin@nodedrops.xyz has scrypt password hash format (salt:key)"
    );

  } catch (error) {
    console.error("Test execution error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n==================================================");
  console.log(`Phase 08 Tests Completed: ${passed} passed, ${failed} failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase08Tests();
