import { timingSafeEqual } from "node:crypto";
import { IncentiveStatus, OpportunityStatus, Prisma } from "@prisma/client";
import { connection, NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ slug: string }> };

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function isAdmin(request: NextRequest) {
  const expected = process.env.ADMIN_API_KEY;
  const header = request.headers.get("authorization") ?? "";
  if (!expected || expected.length < 32 || !header.startsWith("Bearer ")) return false;
  const provided = Buffer.from(header.slice(7).trim(), "utf8");
  const configured = Buffer.from(expected, "utf8");
  return provided.length === configured.length && timingSafeEqual(provided, configured);
}

function validUrl(value: unknown) {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch { return false; }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  if (!isAdmin(request)) return fail("Unauthorized.", 401);
  try {
    await connection();
    const { slug } = await params;
    if (!slug || slug.length > 180 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return fail("Invalid opportunity slug.", 400);
    if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return fail("Content-Type must be application/json.", 415);
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 12000) return fail("Request body is too large.", 413);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return fail("Request body must be valid JSON.", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail("Request body must be an object.", 400);
    const input = body as Record<string, unknown>;
    const allowed = ["name", "summary", "category", "network", "status", "incentiveStatus", "difficulty", "estimatedCostUsd", "officialUrl", "logoUrl", "sourceUrl", "verificationNotes", "lastVerifiedAt"];
    const unknown = Object.keys(input).filter((key) => !allowed.includes(key));
    if (unknown.length || Object.keys(input).length === 0) return fail("Unknown fields or empty update.", 400);
    const data: Record<string, unknown> = {};
    const limits: Record<string, number> = { name: 160, summary: 500, category: 80, network: 120, difficulty: 40, officialUrl: 2048, logoUrl: 2048, sourceUrl: 2048, verificationNotes: 10000 };
    for (const [field, max] of Object.entries(limits)) {
      if (!(field in input)) continue;
      const value = input[field];
      if (value !== null && typeof value !== "string") return fail(`Invalid ${field}.`, 400);
      if (typeof value === "string" && value.trim().length > max) return fail(`Invalid ${field} length.`, 400);
      const clean = typeof value === "string" ? value.trim() : value;
      if ((field === "name" && (typeof clean !== "string" || clean.length < 2)) || (field === "summary" && (typeof clean !== "string" || clean.length < 10)) || (field === "category" && (typeof clean !== "string" || clean.length < 2))) return fail(`Invalid ${field}.`, 400);
      data[field] = clean || null;
    }
    if ("status" in input) {
      if (typeof input.status !== "string" || !Object.values(OpportunityStatus).includes(input.status as OpportunityStatus)) return fail("Invalid opportunity status.", 400);
      data.status = input.status;
    }
    if ("incentiveStatus" in input) {
      if (typeof input.incentiveStatus !== "string" || !Object.values(IncentiveStatus).includes(input.incentiveStatus as IncentiveStatus)) return fail("Invalid incentive status.", 400);
      data.incentiveStatus = input.incentiveStatus;
    }
    if ("estimatedCostUsd" in input) {
      const value = input.estimatedCostUsd;
      if (value !== null && value !== "" && (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 99999999.99 || Math.round(value * 100) !== value * 100)) return fail("Invalid estimatedCostUsd.", 400);
      data.estimatedCostUsd = value === "" ? null : value;
    }
    for (const field of ["officialUrl", "logoUrl", "sourceUrl"]) if (field in data && !validUrl(data[field])) return fail(`${field} must be a valid HTTP or HTTPS URL.`, 400);
    if ("lastVerifiedAt" in input) {
      if (input.lastVerifiedAt === null || input.lastVerifiedAt === "") data.lastVerifiedAt = null;
      else if (typeof input.lastVerifiedAt === "string" && Number.isFinite(new Date(input.lastVerifiedAt).getTime())) data.lastVerifiedAt = new Date(input.lastVerifiedAt);
      else return fail("Invalid lastVerifiedAt.", 400);
    }
    const current = await prisma.opportunity.findUnique({ where: { slug } });
    if (!current || current.isDemo || slug === "example-testnet") return fail("Opportunity not found.", 404);
    const merged = { ...current, ...data };
    const evidence = typeof merged.sourceUrl === "string" && merged.sourceUrl.length > 0 && typeof merged.verificationNotes === "string" && merged.verificationNotes.trim().length >= 10;
    if ((merged.incentiveStatus === IncentiveStatus.CONFIRMED || merged.lastVerifiedAt) && !evidence) return fail("Confirmed or verified records require a source URL and verification notes of at least 10 characters.", 400);
    const updated = await prisma.opportunity.update({ where: { slug }, data: data as Prisma.OpportunityUpdateInput });
    return NextResponse.json({ data: updated }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return fail("An opportunity with this slug already exists.", 409);
    console.error("Admin PATCH opportunity failed:", error);
    return fail("Unable to update this opportunity.", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  if (!isAdmin(request)) return fail("Unauthorized.", 401);
  try {
    await connection();
    const { slug } = await params;
    if (!slug || slug.length > 180 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return fail("Invalid opportunity slug.", 400);
    const current = await prisma.opportunity.findUnique({ where: { slug } });
    if (!current || current.isDemo || slug === "example-testnet") return fail("Opportunity not found.", 404);
    await prisma.opportunity.delete({ where: { slug } });
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin DELETE opportunity failed:", error);
    return fail("Unable to delete this opportunity.", 500);
  }
}
