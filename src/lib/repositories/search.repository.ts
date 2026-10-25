import prisma from "@/lib/prisma";
import { NetworkStatus, PublicationStatus, Category } from "@prisma/client";
import { NetworkWithRelations } from "@/components/network/NetworkCard";
import { GuideWithRelations } from "@/lib/repositories/guide.repository";

export interface SearchFilters {
  query?: string;
  type?: "all" | "networks" | "guides" | "categories";
  page?: number;
  pageSize?: number;
}

export type CategorySearchResult = Category & {
  _count: { guides: number };
};

export interface GlobalSearchResponse {
  query: string;
  type: "all" | "networks" | "guides" | "categories";
  totalCount: number;
  counts: {
    networks: number;
    guides: number;
    categories: number;
  };
  networks: NetworkWithRelations[];
  guides: GuideWithRelations[];
  categories: CategorySearchResult[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export async function searchGlobal(filters: SearchFilters = {}): Promise<GlobalSearchResponse> {
  const rawQuery = filters.query?.trim() || "";
  // Sanitize query to prevent excessive queries
  const query = rawQuery.slice(0, 100);
  const type = filters.type || "all";
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize || 10));
  const skip = (page - 1) * pageSize;

  const networkIncludes = {
    clients: true,
    hardwareRequirements: true,
    _count: {
      select: {
        networkGuides: true,
      },
    },
  };

  const guideIncludes = {
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
  };

  if (!query) {
    try {
      const [networks, guides, categories, netCount, guideCount, catCount] = await Promise.all([
        prisma.network.findMany({
          where: { status: NetworkStatus.ACTIVE },
          include: networkIncludes,
          orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
          take: type === "networks" ? pageSize : 6,
          skip: type === "networks" ? skip : 0,
        }),
        prisma.guide.findMany({
          where: { publicationStatus: PublicationStatus.PUBLISHED },
          include: guideIncludes,
          orderBy: [{ verifiedAt: "desc" }, { createdAt: "desc" }],
          take: type === "guides" ? pageSize : 6,
          skip: type === "guides" ? skip : 0,
        }),
        prisma.category.findMany({
          include: {
            _count: {
              select: {
                guides: {
                  where: { publicationStatus: PublicationStatus.PUBLISHED },
                },
              },
            },
          },
          orderBy: { displayOrder: "asc" },
          take: type === "categories" ? pageSize : 6,
          skip: type === "categories" ? skip : 0,
        }),
        prisma.network.count({ where: { status: NetworkStatus.ACTIVE } }),
        prisma.guide.count({ where: { publicationStatus: PublicationStatus.PUBLISHED } }),
        prisma.category.count(),
      ]);

      const relevantTotal =
        type === "networks"
          ? netCount
          : type === "guides"
          ? guideCount
          : type === "categories"
          ? catCount
          : netCount + guideCount + catCount;

      return {
        query: "",
        type,
        totalCount: relevantTotal,
        counts: {
          networks: netCount,
          guides: guideCount,
          categories: catCount,
        },
        networks,
        guides,
        categories,
        currentPage: page,
        totalPages: Math.ceil(relevantTotal / pageSize) || 1,
        pageSize,
      };
    } catch (error) {
      console.error("Empty search query error:", error);
      return {
        query: "",
        type,
        totalCount: 0,
        counts: { networks: 0, guides: 0, categories: 0 },
        networks: [],
        guides: [],
        categories: [],
        currentPage: page,
        totalPages: 1,
        pageSize,
      };
    }
  }

  try {
    const networkWhere = {
      status: NetworkStatus.ACTIVE,
      OR: [
        { name: { contains: query } },
        { symbol: { contains: query } },
        { category: { contains: query } },
        { layer: { contains: query } },
        { consensus: { contains: query } },
        { clients: { some: { name: { contains: query } } } },
      ],
    };

    const guideWhere = {
      publicationStatus: PublicationStatus.PUBLISHED,
      OR: [
        { title: { contains: query } },
        { summary: { contains: query } },
        { content: { contains: query } },
        {
          guideNetworks: {
            some: {
              network: {
                name: { contains: query },
              },
            },
          },
        },
      ],
    };

    const categoryWhere = {
      OR: [{ name: { contains: query } }, { description: { contains: query } }],
    };

    const [netCount, guideCount, catCount] = await Promise.all([
      prisma.network.count({ where: networkWhere }),
      prisma.guide.count({ where: guideWhere }),
      prisma.category.count({ where: categoryWhere }),
    ]);

    const shouldFetchNetworks = type === "all" || type === "networks";
    const shouldFetchGuides = type === "all" || type === "guides";
    const shouldFetchCategories = type === "all" || type === "categories";

    const [networks, guides, categories] = await Promise.all([
      shouldFetchNetworks
        ? prisma.network.findMany({
            where: networkWhere,
            include: networkIncludes,
            orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
            take: type === "networks" ? pageSize : 6,
            skip: type === "networks" ? skip : 0,
          })
        : Promise.resolve([]),
      shouldFetchGuides
        ? prisma.guide.findMany({
            where: guideWhere,
            include: guideIncludes,
            orderBy: [{ verifiedAt: "desc" }, { createdAt: "desc" }],
            take: type === "guides" ? pageSize : 6,
            skip: type === "guides" ? skip : 0,
          })
        : Promise.resolve([]),
      shouldFetchCategories
        ? prisma.category.findMany({
            where: categoryWhere,
            include: {
              _count: {
                select: {
                  guides: {
                    where: { publicationStatus: PublicationStatus.PUBLISHED },
                  },
                },
              },
            },
            orderBy: { displayOrder: "asc" },
            take: type === "categories" ? pageSize : 6,
            skip: type === "categories" ? skip : 0,
          })
        : Promise.resolve([]),
    ]);

    const totalMatching =
      type === "networks"
        ? netCount
        : type === "guides"
        ? guideCount
        : type === "categories"
        ? catCount
        : netCount + guideCount + catCount;

    return {
      query,
      type,
      totalCount: totalMatching,
      counts: {
        networks: netCount,
        guides: guideCount,
        categories: catCount,
      },
      networks,
      guides,
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalMatching / pageSize) || 1,
      pageSize,
    };
  } catch (error) {
    console.error("Global search error:", error);
    return {
      query,
      type,
      totalCount: 0,
      counts: { networks: 0, guides: 0, categories: 0 },
      networks: [],
      guides: [],
      categories: [],
      currentPage: page,
      totalPages: 1,
      pageSize,
    };
  }
}
