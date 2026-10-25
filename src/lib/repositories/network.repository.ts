import prisma from "@/lib/prisma";
import { NetworkType, NetworkStatus } from "@prisma/client";

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
  return prisma.network.findUnique({
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
