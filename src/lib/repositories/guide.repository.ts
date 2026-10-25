import prisma from "@/lib/prisma";
import { PublicationStatus, Difficulty, Prisma } from "@prisma/client";

export interface GuideQueryFilters {
  query?: string;
  difficulty?: Difficulty;
  networkSlug?: string;
  categorySlug?: string;
  status?: PublicationStatus;
  page?: number;
  pageSize?: number;
}

export type GuideWithRelations = Prisma.GuideGetPayload<{
  include: {
    category: true;
    author: {
      select: { id: true; name: true; email: true };
    };
    guideNetworks: {
      include: {
        network: true;
      };
    };
    guideSources: {
      include: {
        source: true;
      };
    };
  };
}>;

export interface PaginatedGuidesResult {
  guides: GuideWithRelations[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export async function getPaginatedGuides(
  filters: GuideQueryFilters = {}
): Promise<PaginatedGuidesResult> {
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize || 8));
  const skip = (page - 1) * pageSize;

  // Enforce publicationStatus: strictly PUBLISHED for public queries
  const where: Prisma.GuideWhereInput = {
    publicationStatus: filters.status || PublicationStatus.PUBLISHED,
  };

  if (filters.difficulty) {
    where.difficulty = filters.difficulty;
  }

  if (filters.categorySlug && filters.categorySlug !== "All") {
    where.category = {
      slug: filters.categorySlug,
    };
  }

  if (filters.networkSlug && filters.networkSlug !== "All") {
    where.guideNetworks = {
      some: {
        network: {
          slug: filters.networkSlug,
        },
      },
    };
  }

  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim();
    where.OR = [
      { title: { contains: q } },
      { summary: { contains: q } },
      { content: { contains: q } },
      {
        guideNetworks: {
          some: {
            network: {
              name: { contains: q },
            },
          },
        },
      },
    ];
  }

  try {
    const [total, guides] = await Promise.all([
      prisma.guide.count({ where }),
      prisma.guide.findMany({
        where,
        include: {
          category: true,
          author: {
            select: { id: true, name: true, email: true },
          },
          guideNetworks: {
            include: {
              network: true,
            },
          },
          guideSources: {
            include: {
              source: true,
            },
          },
        },
        orderBy: [{ verifiedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      guides,
      total,
      totalPages,
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    console.error("Database query error in getPaginatedGuides:", error);
    return {
      guides: [],
      total: 0,
      totalPages: 1,
      currentPage: page,
      pageSize,
    };
  }
}

export async function getAllGuides(options?: {
  status?: PublicationStatus;
  difficulty?: Difficulty;
  limit?: number;
}) {
  return prisma.guide.findMany({
    where: {
      publicationStatus: options?.status ?? PublicationStatus.PUBLISHED,
      difficulty: options?.difficulty,
    },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, email: true },
      },
      guideNetworks: {
        include: {
          network: true,
        },
      },
      guideSources: {
        include: {
          source: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: options?.limit,
  });
}

export async function getGuideBySlug(slug: string) {
  try {
    const guide = await prisma.guide.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: { id: true, name: true },
        },
        guideNetworks: {
          include: {
            network: {
              include: {
                hardwareRequirements: true,
                clients: true,
              },
            },
          },
        },
        guideSources: {
          include: {
            source: true,
          },
        },
      },
    });

    // Guard: Only return if PUBLISHED
    if (guide && guide.publicationStatus !== PublicationStatus.PUBLISHED) {
      return null;
    }

    return guide;
  } catch (error) {
    console.error(`Database error fetching guide '${slug}':`, error);
    return null;
  }
}

export async function getGuidesByNetworkSlug(networkSlug: string) {
  return prisma.guide.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      guideNetworks: {
        some: {
          network: {
            slug: networkSlug,
          },
        },
      },
    },
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getGuideFilterOptions() {
  try {
    const [categories, networks] = await Promise.all([
      prisma.category.findMany({
        where: {
          guides: {
            some: {
              publicationStatus: PublicationStatus.PUBLISHED,
            },
          },
        },
        select: { name: true, slug: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.network.findMany({
        where: {
          networkGuides: {
            some: {
              guide: {
                publicationStatus: PublicationStatus.PUBLISHED,
              },
            },
          },
        },
        select: { name: true, slug: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      categories,
      networks,
    };
  } catch (error) {
    console.error("Failed to load guide filter options:", error);
    return {
      categories: [],
      networks: [],
    };
  }
}

export async function incrementGuideViewCount(id: string) {
  try {
    await prisma.guide.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Non-critical metric increment
  }
}
