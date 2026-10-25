import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { PublicationStatus, NetworkStatus } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nodedrops.xyz";
  const now = new Date();

  // 1. Static Core Public Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/networks`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/testnets`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mainnets`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    // 2. Dynamic Published Networks
    const networks = await prisma.network.findMany({
      where: {
        status: {
          in: [NetworkStatus.ACTIVE, NetworkStatus.MAINTENANCE],
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const networkRoutes: MetadataRoute.Sitemap = networks.map((net) => ({
      url: `${baseUrl}/networks/${net.slug}`,
      lastModified: net.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 3. Dynamic Published Guides (STRICTLY filter publicationStatus: PUBLISHED)
    const guides = await prisma.guide.findMany({
      where: {
        publicationStatus: PublicationStatus.PUBLISHED,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: guide.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 4. Dynamic Categories containing published guides
    const categories = await prisma.category.findMany({
      where: {
        guides: {
          some: {
            publicationStatus: PublicationStatus.PUBLISHED,
          },
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...networkRoutes, ...guideRoutes, ...categoryRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return staticRoutes;
  }
}
