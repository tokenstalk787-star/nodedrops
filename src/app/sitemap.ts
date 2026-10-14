
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nodedrops.xyz"
  ).replace(/\/+$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/opportunities`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  if (process.env.NODE_ENV !== "production") {
    return staticRoutes;
  }

  const opportunities = await prisma.opportunity.findMany({
    where: {
      isDemo: false,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5000,
  });

  const opportunityRoutes: MetadataRoute.Sitemap = opportunities.map(
    (opportunity) => ({
      url: `${siteUrl}/opportunities/${opportunity.slug}`,
      lastModified: opportunity.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...opportunityRoutes];
}
