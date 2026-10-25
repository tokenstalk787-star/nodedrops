import prisma from "./prisma";

export interface DatabaseHealth {
  connected: boolean;
  timestamp: string;
  error?: string;
  counts?: {
    networks: number;
    guides: number;
    categories: number;
    sources: number;
    users: number;
  };
}

/**
 * Pings MySQL database through Prisma and returns record counts.
 */
export async function checkDatabaseConnection(): Promise<DatabaseHealth> {
  const timestamp = new Date().toISOString();
  try {
    // Basic ping query
    await prisma.$queryRaw`SELECT 1`;

    // Fetch entity metrics
    const [networks, guides, categories, sources, users] = await Promise.all([
      prisma.network.count(),
      prisma.guide.count(),
      prisma.category.count(),
      prisma.source.count(),
      prisma.user.count(),
    ]);

    return {
      connected: true,
      timestamp,
      counts: {
        networks,
        guides,
        categories,
        sources,
        users,
      },
    };
  } catch (error) {
    return {
      connected: false,
      timestamp,
      error: error instanceof Error ? error.message : "Unknown database connection failure",
    };
  }
}
