import prisma from "@/lib/prisma";
import { NetworkType, NetworkStatus, Prisma } from "@prisma/client";

export interface NetworkQueryFilters {
  query?: string;
  type?: NetworkType;
  category?: string;
  nodeRole?: string;
  status?: NetworkStatus;
  sortBy?: "name_asc" | "name_desc" | "newest" | "featured";
  page?: number;
  pageSize?: number;
}

export interface PaginatedNetworksResult {
  networks: Prisma.NetworkGetPayload<{
    include: {
      clients: true;
      hardwareRequirements: true;
      _count: { select: { networkGuides: true } };
    };
  }>[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export async function getPaginatedNetworks(
  filters: NetworkQueryFilters = {}
): Promise<PaginatedNetworksResult> {
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize || 9));
  const skip = (page - 1) * pageSize;

  // Build where conditions
  const where: Prisma.NetworkWhereInput = {};

  if (filters.type) {
    where.networkType = filters.type;
  }

  if (filters.status) {
    where.status = filters.status;
  } else {
    // Default to active networks unless explicitly requested
    where.status = NetworkStatus.ACTIVE;
  }

  if (filters.category && filters.category !== "All") {
    where.category = filters.category;
  }

  if (filters.nodeRole && filters.nodeRole !== "All") {
    where.hardwareRequirements = {
      some: {
        nodeType: {
          contains: filters.nodeRole,
        },
      },
    };
  }

  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim();
    where.OR = [
      { name: { contains: q } },
      { symbol: { contains: q } },
      { category: { contains: q } },
      { consensus: { contains: q } },
      { layer: { contains: q } },
      {
        clients: {
          some: {
            name: { contains: q },
          },
        },
      },
    ];
  }

  // Determine sort order
  let orderBy: Prisma.NetworkOrderByWithRelationInput[] = [{ sortOrder: "asc" }, { name: "asc" }];
  if (filters.sortBy === "name_asc") {
    orderBy = [{ name: "asc" }];
  } else if (filters.sortBy === "name_desc") {
    orderBy = [{ name: "desc" }];
  } else if (filters.sortBy === "newest") {
    orderBy = [{ createdAt: "desc" }];
  } else if (filters.sortBy === "featured") {
    orderBy = [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }];
  }

  try {
    const [total, networks] = await Promise.all([
      prisma.network.count({ where }),
      prisma.network.findMany({
        where,
        include: {
          clients: true,
          hardwareRequirements: true,
          _count: {
            select: { networkGuides: true },
          },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      networks,
      total,
      totalPages,
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    console.error("Database query error in getPaginatedNetworks:", error);
    return {
      networks: [],
      total: 0,
      totalPages: 1,
      currentPage: page,
      pageSize,
    };
  }
}

export async function getAllNetworks(options?: {
  type?: NetworkType;
  status?: NetworkStatus;
  featuredOnly?: boolean;
}) {
  return prisma.network.findMany({
    where: {
      networkType: options?.type,
      status: options?.status ?? NetworkStatus.ACTIVE,
      isFeatured: options?.featuredOnly ? true : undefined,
    },
    include: {
      clients: true,
      hardwareRequirements: true,
      _count: {
        select: { networkGuides: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getNetworkBySlug(slug: string) {
  try {
    return await prisma.network.findUnique({
      where: { slug },
      include: {
        clients: true,
        hardwareRequirements: true,
        networkGuides: {
          include: {
            guide: {
              include: {
                category: true,
              },
            },
          },
        },
        networkSources: {
          include: {
            source: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(`Database error fetching network with slug '${slug}':`, error);
    return null;
  }
}

export async function searchNetworks(query: string) {
  return prisma.network.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { symbol: { contains: query } },
        { category: { contains: query } },
        { consensus: { contains: query } },
      ],
    },
    include: {
      clients: true,
      hardwareRequirements: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getNetworkFilterOptions() {
  try {
    const [categories, types, nodeTypes] = await Promise.all([
      prisma.network.findMany({
        select: { category: true },
        distinct: ["category"],
        where: { status: NetworkStatus.ACTIVE },
      }),
      prisma.network.findMany({
        select: { networkType: true },
        distinct: ["networkType"],
        where: { status: NetworkStatus.ACTIVE },
      }),
      prisma.hardwareRequirement.findMany({
        select: { nodeType: true },
        distinct: ["nodeType"],
      }),
    ]);

    return {
      categories: categories.map((c) => c.category),
      types: types.map((t) => t.networkType),
      nodeRoles: nodeTypes.map((n) => n.nodeType),
    };
  } catch (error) {
    console.error("Failed to load network filter options:", error);
    return {
      categories: ["Layer 1", "Layer 2", "Rollup"],
      types: [NetworkType.MAINNET, NetworkType.TESTNET],
      nodeRoles: ["Full Node", "Validator Node", "RPC Node"],
    };
  }
}
