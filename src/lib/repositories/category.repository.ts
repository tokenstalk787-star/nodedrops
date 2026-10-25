import prisma from "@/lib/prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: {
          guides: {
            where: { publicationStatus: "PUBLISHED" },
          },
        },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        guides: {
          where: { publicationStatus: "PUBLISHED" },
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
        },
      },
    });
  } catch (error) {
    console.error(`Database error fetching category '${slug}':`, error);
    return null;
  }
}
