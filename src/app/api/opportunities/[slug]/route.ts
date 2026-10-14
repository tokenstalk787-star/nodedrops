
import { connection, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    await connection();
    const { slug } = await params;

    if (
      !slug ||
      slug.length > 180 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ) {
      return NextResponse.json(
        { error: "Invalid opportunity slug." },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        slug,
        isDemo: false,
        NOT: { slug: "example-testnet" },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        summary: true,
        category: true,
        network: true,
        status: true,
        incentiveStatus: true,
        difficulty: true,
        estimatedCostUsd: true,
        officialUrl: true,
        lastVerifiedAt: true,
        verificationNotes: true,
        sourceUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found." },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    return NextResponse.json(
      {
        data: {
          ...opportunity,
          estimatedCostUsd:
            opportunity.estimatedCostUsd?.toString() ?? null,
          lastVerifiedAt:
            opportunity.lastVerifiedAt?.toISOString() ?? null,
          createdAt: opportunity.createdAt.toISOString(),
          updatedAt: opportunity.updatedAt.toISOString(),
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("GET /api/opportunities/[slug] failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve this opportunity." },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
