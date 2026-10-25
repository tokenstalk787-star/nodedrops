export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nodedrops.xyz";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates Schema.org WebSite & Organization structured data
 */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NodeDrops",
    url: BASE_URL,
    description: "Your Guide to Running Blockchain Nodes — Layer 1 and Layer 2 Runbooks and Capacity Tools",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "NodeDrops",
      url: BASE_URL,
      logo: `${BASE_URL}/icon.svg`,
    },
  };
}

/**
 * Generates Schema.org TechArticle & HowTo structured data for runbooks
 */
export function buildGuideSchema(guide: {
  title: string;
  summary: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  difficulty?: string;
  estimatedMinutes?: number | null;
  author?: { name?: string | null } | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.summary,
    url: `${BASE_URL}/guides/${guide.slug}`,
    datePublished: guide.createdAt.toISOString(),
    dateModified: guide.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: guide.author?.name || "NodeDrops Infrastructure Team",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "NodeDrops",
      url: BASE_URL,
    },
    proficiencyLevel: guide.difficulty || "Intermediate",
    timeRequired: guide.estimatedMinutes ? `PT${guide.estimatedMinutes}M` : undefined,
    inLanguage: "en-US",
  };
}
