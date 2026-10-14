
import { timingSafeEqual } from "node:crypto";
import {
  IncentiveStatus,
  OpportunityStatus,
  Prisma,
} from "@prisma/client";
import {
  connection,
  NextRequest,
  NextResponse,
} from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;
const MAX_QUERY_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 80;
const MAX_BODY_LENGTH = 12_000;
const MAX_URL_LENGTH = 2_048;
const MAX_VERIFICATION_NOTES_LENGTH = 10_000;

type JsonObject = Record<string, unknown>;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

function parsePositiveInteger(
  value: string | null,
  fallback: number,
): number | null {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed >= 1
    ? parsed
    : null;
}

function isValidEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string,
): value is T[keyof T] {
  return Object.values(enumObject).some(
    (item) => item === value,
  );
}

function isObject(value: unknown): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * undefined means the field was omitted.
 * null means explicitly null or an empty string.
 * Invalid types and excessive lengths return undefined too,
 * so supplied fields must be checked separately before use.
 */
function optionalString(
  value: unknown,
  maxLength: number,
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;

  const cleaned = value.trim();

  if (cleaned.length > maxLength) return undefined;

  return cleaned || null;
}

function isValidOptionalString(
  body: JsonObject,
  field: string,
  parsedValue: string | null | undefined,
): boolean {
  // Omitted optional fields are valid.
  if (!(field in body)) return true;

  // Explicit null is valid.
  if (body[field] === null) return true;

  // Strings (including empty strings) are parsed to string/null.
  // undefined here means the supplied value was invalid.
  return parsedValue !== undefined;
}

function validHttpUrl(
  value: string | null | undefined,
): boolean {
  if (value == null) return true;

  try {
    const url = new URL(value);

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function isValidSlug(value: string): boolean {
  return (
    value.length >= 2 &&
    value.length <= 180 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  );
}

function hasValidAdminKey(request: NextRequest): boolean {
  const expected = process.env.ADMIN_API_KEY;

  // Fail closed: writes are disabled unless a strong key is configured.
  if (!expected || expected.length < 32) return false;

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) return false;

  const provided = authorization.slice(7).trim();

  if (!provided || provided.length > 512) return false;

  const providedBuffer = Buffer.from(provided, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

function parseOptionalDate(
  value: unknown,
): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string") return undefined;

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) return undefined;

  return date;
}

function parseCost(
  value: unknown,
): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 99_999_999.99 ||
    Math.round(value * 100) !== value * 100
  ) {
    return undefined;
  }

  return value;
}

/**
 * GET /api/opportunities
 *
 * Query parameters:
 * q, category, status, incentiveStatus, includeDemo, page, limit
 */
export async function GET(request: NextRequest) {
  await connection();

  try {
    const params = request.nextUrl.searchParams;

    const query = params.get("q")?.trim() ?? "";
    const category = params.get("category")?.trim() ?? "";
    const status = params.get("status")?.trim() ?? "";
    const incentiveStatus =
      params.get("incentiveStatus")?.trim() ?? "";
    const includeDemoParam = params.get("includeDemo");

    if (query.length > MAX_QUERY_LENGTH) {
      return jsonError(
        `Search query cannot exceed ${MAX_QUERY_LENGTH} characters.`,
        400,
      );
    }

    if (category.length > MAX_CATEGORY_LENGTH) {
      return jsonError(
        `Category cannot exceed ${MAX_CATEGORY_LENGTH} characters.`,
        400,
      );
    }

    if (
      includeDemoParam !== null &&
      includeDemoParam !== "true" &&
      includeDemoParam !== "false"
    ) {
      return jsonError("includeDemo must be true or false.", 400);
    }

    // Demo records may be useful locally, but must never leak through the
    // public production API, even when a caller supplies includeDemo=true.
    if (
      process.env.NODE_ENV === "production" &&
      includeDemoParam === "true"
    ) {
      return jsonError("Demo records are not available in production.", 400);
    }

    const page = parsePositiveInteger(params.get("page"), 1);
    const requestedLimit = parsePositiveInteger(
      params.get("limit"),
      DEFAULT_LIMIT,
    );

    if (page === null || requestedLimit === null) {
      return jsonError(
        "Page and limit must be positive integers.",
        400,
      );
    }

    const limit = Math.min(requestedLimit, MAX_LIMIT);
    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      return jsonError("Requested page is too large.", 400);
    }

    if (status && !isValidEnumValue(OpportunityStatus, status)) {
      return jsonError("Invalid opportunity status.", 400);
    }

    if (
      incentiveStatus &&
      !isValidEnumValue(IncentiveStatus, incentiveStatus)
    ) {
      return jsonError("Invalid incentive status.", 400);
    }

    const where: Prisma.OpportunityWhereInput = {
      isDemo: includeDemoParam === "true" ? undefined : false,
      NOT: { slug: "example-testnet" },
    };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { summary: { contains: query } },
        { category: { contains: query } },
        { network: { contains: query } },
      ];
    }

    if (category) where.category = category;

    if (status) {
      where.status = status as OpportunityStatus;
    }

    if (incentiveStatus) {
      where.incentiveStatus =
        incentiveStatus as IncentiveStatus;
    }

    const [total, opportunities] = await prisma.$transaction([
      prisma.opportunity.count({ where }),
      prisma.opportunity.findMany({
        where,
        orderBy: [
          { updatedAt: "desc" },
          { name: "asc" },
        ],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json(
      {
        data: opportunities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("GET /api/opportunities failed:", error);

    return jsonError(
      "Unable to fetch opportunities at this time.",
      500,
    );
  }
}

/**
 * POST /api/opportunities
 *
 * Requires Authorization: Bearer <ADMIN_API_KEY>
 */
export async function POST(request: NextRequest) {
  await connection();

  if (!hasValidAdminKey(request)) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const contentType =
      request.headers.get("content-type")?.toLowerCase() ?? "";

    if (!contentType.includes("application/json")) {
      return jsonError(
        "Content-Type must be application/json.",
        415,
      );
    }

    const contentLengthHeader = request.headers.get("content-length");

    if (contentLengthHeader !== null) {
      if (!/^\d+$/.test(contentLengthHeader)) {
        return jsonError("Invalid Content-Length header.", 400);
      }

      if (Number(contentLengthHeader) > MAX_BODY_LENGTH) {
        return jsonError("Request body is too large.", 413);
      }
    }

    const rawBody = await request.text();

    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_LENGTH) {
      return jsonError("Request body is too large.", 413);
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonError("Request body must be valid JSON.", 400);
    }

    if (!isObject(body)) {
      return jsonError(
        "Request body must be a JSON object.",
        400,
      );
    }

    const allowedFields = new Set([
      "name",
      "slug",
      "summary",
      "category",
      "network",
      "status",
      "incentiveStatus",
      "difficulty",
      "estimatedCostUsd",
      "officialUrl",
      "lastVerifiedAt",
      "verificationNotes",
      "sourceUrl",
    ]);

    const unknownFields = Object.keys(body).filter(
      (key) => !allowedFields.has(key),
    );

    if (unknownFields.length > 0) {
      return jsonError(
        `Unknown field(s): ${unknownFields.join(", ")}.`,
        400,
      );
    }

    const name = optionalString(body.name, 160);
    const slug = optionalString(body.slug, 180);
    const summary = optionalString(body.summary, 500);
    const category = optionalString(body.category, MAX_CATEGORY_LENGTH);

    if (
      typeof name !== "string" ||
      typeof slug !== "string" ||
      typeof summary !== "string" ||
      typeof category !== "string"
    ) {
      return jsonError(
        "Name, slug, summary, and category are required strings within their length limits.",
        400,
      );
    }

    if (
      name.length < 2 ||
      summary.length < 10 ||
      category.length < 2
    ) {
      return jsonError(
        "Name and category must contain at least 2 characters; summary must contain at least 10.",
        400,
      );
    }

    if (!isValidSlug(slug)) {
      return jsonError(
        "Slug must be 2–180 lowercase letters or numbers separated by single hyphens.",
        400,
      );
    }

    const network = optionalString(body.network, 120);
    const difficulty = optionalString(body.difficulty, 40);
    const officialUrl = optionalString(body.officialUrl, MAX_URL_LENGTH);
    const sourceUrl = optionalString(body.sourceUrl, MAX_URL_LENGTH);
    const verificationNotes = optionalString(
      body.verificationNotes,
      MAX_VERIFICATION_NOTES_LENGTH,
    );

    const optionalFields = [
      ["network", network, 120],
      ["difficulty", difficulty, 40],
      ["officialUrl", officialUrl, MAX_URL_LENGTH],
      ["sourceUrl", sourceUrl, MAX_URL_LENGTH],
      [
        "verificationNotes",
        verificationNotes,
        MAX_VERIFICATION_NOTES_LENGTH,
      ],
    ] as const;

    for (const [field, value] of optionalFields) {
      if (!isValidOptionalString(body, field, value)) {
        return jsonError(
          `${field} must be a string or null within its length limit.`,
          400,
        );
      }
    }

    if (
      !validHttpUrl(officialUrl) ||
      !validHttpUrl(sourceUrl)
    ) {
      return jsonError(
        "Official and source URLs must be valid HTTP or HTTPS URLs.",
        400,
      );
    }

    const status =
      body.status === undefined
        ? OpportunityStatus.UPCOMING
        : body.status;

    const incentiveStatus =
      body.incentiveStatus === undefined
        ? IncentiveStatus.NOT_ANNOUNCED
        : body.incentiveStatus;

    if (
      typeof status !== "string" ||
      !isValidEnumValue(OpportunityStatus, status)
    ) {
      return jsonError("Invalid opportunity status.", 400);
    }

    if (
      typeof incentiveStatus !== "string" ||
      !isValidEnumValue(IncentiveStatus, incentiveStatus)
    ) {
      return jsonError("Invalid incentive status.", 400);
    }

    const estimatedCostUsd = parseCost(body.estimatedCostUsd);

    if (
      body.estimatedCostUsd !== undefined &&
      estimatedCostUsd === undefined
    ) {
      return jsonError(
        "estimatedCostUsd must be a non-negative number with at most 2 decimal places, or null.",
        400,
      );
    }

    const lastVerifiedAt = parseOptionalDate(body.lastVerifiedAt);

    if (
      body.lastVerifiedAt !== undefined &&
      lastVerifiedAt === undefined
    ) {
      return jsonError(
        "lastVerifiedAt must be a valid date string or null.",
        400,
      );
    }

    const hasEvidence =
      typeof sourceUrl === "string" &&
      sourceUrl.length > 0 &&
      typeof verificationNotes === "string" &&
      verificationNotes.length >= 10;

    if (
      lastVerifiedAt instanceof Date &&
      !hasEvidence
    ) {
      return jsonError(
        "A verification date requires a sourceUrl and verificationNotes of at least 10 characters.",
        400,
      );
    }

    if (
      incentiveStatus === IncentiveStatus.CONFIRMED &&
      !hasEvidence
    ) {
      return jsonError(
        "Confirmed incentives require a sourceUrl and verificationNotes of at least 10 characters.",
        400,
      );
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        name,
        slug,
        summary,
        category,
        network: network ?? null,
        status,
        incentiveStatus,
        difficulty: difficulty ?? null,
        estimatedCostUsd: estimatedCostUsd ?? null,
        officialUrl: officialUrl ?? null,
        lastVerifiedAt: lastVerifiedAt ?? null,
        verificationNotes: verificationNotes ?? null,
        sourceUrl: sourceUrl ?? null,
        isDemo: false,
      },
    });

    return NextResponse.json(
      { data: opportunity },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return jsonError(
        "An opportunity with this slug already exists.",
        409,
      );
    }

    console.error("POST /api/opportunities failed:", error);

    return jsonError(
      "Unable to create the opportunity at this time.",
      500,
    );
  }
}
