import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processGitHubPublisherPayload } from "@/lib/github-publisher/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 100_000;
const PayloadSchema = z.object({
  repository: z.string().min(3).max(200),
  commit: z.string().regex(/^[0-9a-f]{40}$/i),
  files: z.array(z.object({
    path: z.string().min(1).max(500),
    status: z.enum(["upsert", "deleted"]),
  })).max(30),
});

function verifySignature(raw: string, signature: string, secret: string): boolean {
  if (!signature.startsWith("sha256=")) return false;
  const supplied = signature.slice(7);
  if (!/^[a-f0-9]{64}$/i.test(supplied)) return false;
  const expected = createHmac("sha256", secret).update(raw, "utf8").digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const suppliedBuffer = Buffer.from(supplied, "hex");
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function POST(request: NextRequest) {
  const secret = process.env.NODEDROPS_GITHUB_PUBLISH_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ error: "GitHub publisher is not configured." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: "Unable to read request body." }, { status: 400 });
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  const signature = request.headers.get("x-nodedrops-signature") ?? "";
  if (!verifySignature(raw, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Payload must be JSON." }, { status: 400 });
  }

  const parsed = PayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({
      error: "Invalid publisher payload.",
      details: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    }, { status: 422 });
  }

  try {
    const results = await processGitHubPublisherPayload(parsed.data);
    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (error) {
    console.error("[github-publisher] delivery failed", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Publishing failed.",
    }, { status: 422 });
  }
}
