import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Difficulty, NetworkStatus, NetworkType, PublicationStatus, SourceType, VerificationStatus } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1_000_000;
const httpsUrl = z.string().url().refine((value) => new URL(value).protocol === "https:");

const Schema = z.object({
  title: z.string().trim().min(5).max(180),
  slug: z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(10).max(2000),
  content: z.string().min(20).max(750_000),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.INTERMEDIATE),
  estimatedMinutes: z.number().int().min(5).max(480).default(45),
  categorySlug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  network: z.object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    symbol: z.string().trim().min(1).max(10).transform((v) => v.toUpperCase()),
    chainId: z.string().trim().max(80).optional(),
    networkType: z.nativeEnum(NetworkType),
    category: z.string().trim().min(2).max(80).default("Layer 1"),
    layer: z.string().trim().min(2).max(80).default("Layer 1"),
    consensus: z.string().trim().min(2).max(120).default("Unknown / not specified"),
    websiteUrl: httpsUrl.optional(),
    docsUrl: httpsUrl.optional(),
    githubUrl: httpsUrl.optional(),
    explorerUrl: httpsUrl.optional(),
  }),
  sources: z.array(z.object({
    name: z.string().trim().min(2).max(160),
    url: httpsUrl,
    sourceType: z.nativeEnum(SourceType).default(SourceType.OFFICIAL_DOCS),
    notes: z.string().trim().max(500).optional(),
  })).min(1).max(20),
});

function isAuthorized(request: NextRequest): boolean {
  const expectedKey = process.env.NODEDROPS_AGENT_API_KEY;
  const header = request.headers.get("authorization") || "";
  const suppliedKey = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!expectedKey || expectedKey.length < 32 || !suppliedKey) return false;
  const expectedDigest = createHash("sha256").update(expectedKey).digest();
  const suppliedDigest = createHash("sha256").update(suppliedKey).digest();
  return suppliedKey.length === expectedKey.length && timingSafeEqual(expectedDigest, suppliedDigest);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: "Unable to read request body" }, { status: 400 });
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      error: "Invalid guide payload",
      details: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    }, { status: 422 });
  }

  const input = parsed.data;
  try {
    const [duplicate, category] = await Promise.all([
      prisma.guide.findUnique({ where: { slug: input.slug }, select: { id: true } }),
      prisma.category.findUnique({ where: { slug: input.categorySlug }, select: { id: true } }),
    ]);

    if (duplicate) return NextResponse.json({ error: "A guide with this slug already exists" }, { status: 409 });
    if (!category) {
      return NextResponse.json({ error: "Unknown categorySlug. Create the category in Admin first." }, { status: 422 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;

    const guide = await prisma.$transaction(async (tx) => {
      // Existing network data is linked, never overwritten by the agent.
      const existingNetwork = await tx.network.findUnique({
        where: { slug: input.network.slug },
        select: { id: true },
      });
      const network = existingNetwork ?? await tx.network.create({
        data: {
          name: input.network.name,
          slug: input.network.slug,
          symbol: input.network.symbol,
          chainId: input.network.chainId,
          networkType: input.network.networkType,
          category: input.network.category,
          layer: input.network.layer,
          consensus: input.network.consensus,
          status: NetworkStatus.ACTIVE,
          websiteUrl: input.network.websiteUrl,
          docsUrl: input.network.docsUrl,
          githubUrl: input.network.githubUrl,
          explorerUrl: input.network.explorerUrl,
        },
        select: { id: true },
      });

      const sourceRecords = await Promise.all(input.sources.map((source) =>
        tx.source.upsert({
          where: { url: source.url },
          update: { name: source.name, sourceType: source.sourceType, lastAccessedAt: new Date() },
          create: {
            name: source.name,
            url: source.url,
            sourceType: source.sourceType,
            reliabilityScore: 100,
            lastAccessedAt: new Date(),
          },
          select: { id: true },
        })
      ));

      const created = await tx.guide.create({
        data: {
          title: input.title,
          slug: input.slug,
          summary: input.summary,
          content: input.content,
          difficulty: input.difficulty,
          estimatedMinutes: input.estimatedMinutes,
          categoryId: category.id,
          authorId: null,
          verificationStatus: VerificationStatus.UNDER_REVIEW,
          publicationStatus: PublicationStatus.DRAFT,
          verifiedAt: null,
          guideNetworks: { create: { networkId: network.id, isPrimary: true } },
          guideSources: {
            create: sourceRecords.map((source, index) => ({
              sourceId: source.id,
              notes: input.sources[index]?.notes || "Submitted by the NodeDrops research agent; verify before publication.",
            })),
          },
        },
        select: { id: true, title: true, slug: true, publicationStatus: true, createdAt: true },
      });

      await tx.auditLog.create({
        data: {
          action: "AGENT_GUIDE_DRAFT_CREATED",
          entityType: "Guide",
          entityId: created.id,
          ipAddress,
          metadata: {
            slug: created.slug,
            networkSlug: input.network.slug,
            categorySlug: input.categorySlug,
            sourceCount: sourceRecords.length,
            verificationStatus: VerificationStatus.UNDER_REVIEW,
            publicationStatus: PublicationStatus.DRAFT,
          },
        },
      });
      return created;
    });

    revalidatePath("/admin/guides");
    revalidatePath("/admin");
    return NextResponse.json({
      success: true,
      status: "DRAFT",
      verificationStatus: "UNDER_REVIEW",
      guide: {
        id: guide.id,
        title: guide.title,
        slug: guide.slug,
        adminUrl: "/admin/guides",
        createdAt: guide.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "A guide or network with this unique identifier already exists" }, { status: 409 });
    }
    console.error("[agent-guide-api] Draft creation failed", error);
    return NextResponse.json({ error: "Unable to create guide draft" }, { status: 500 });
  }
}
