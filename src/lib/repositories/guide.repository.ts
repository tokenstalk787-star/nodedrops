import prisma from "@/lib/prisma";
import { PublicationStatus, Difficulty } from "@prisma/client";

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
  return prisma.guide.findUnique({
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
