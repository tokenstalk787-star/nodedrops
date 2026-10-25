import prisma from "@/lib/prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { guides: true },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      guides: {
        where: { publicationStatus: "PUBLISHED" },
        include: {
          guideNetworks: {
            include: {
              network: true,
            },
          },
        },
      },
    },
  });
}
