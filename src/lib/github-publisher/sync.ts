import {
  NetworkStatus,
  PublicationStatus,
  VerificationStatus,
} from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  parsePublisherMarkdown,
  publisherPathToSlug,
} from "@/lib/github-publisher/frontmatter";
import { revalidatePath } from "next/cache";

export interface ChangedGuideFile {
  path: string;
  status: "upsert" | "deleted";
}

export interface GitHubPublishPayload {
  repository: string;
  commit: string;
  files: ChangedGuideFile[];
}

const RAW_BASE = "https://raw.githubusercontent.com";

async function readAtCommit(repository: string, commit: string, path: string): Promise<string> {
  const url = `${RAW_BASE}/${repository}/${commit}/${path}`;
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`GitHub raw fetch failed (${response.status}) for ${path}`);
  const content = await response.text();
  if (content.length > 750_000) throw new Error(`File too large: ${path}`);
  return content;
}

async function archiveDeletedGuide(repository: string, path: string, commit: string) {
  const guide = await prisma.guide.findFirst({
    where: { githubRepository: repository, githubPath: path },
    select: { id: true, slug: true, title: true },
  });
  if (!guide) return { action: "ignored-delete", path };

  await prisma.$transaction([
    prisma.guide.update({
      where: { id: guide.id },
      data: { publicationStatus: PublicationStatus.ARCHIVED, githubCommit: commit },
    }),
    prisma.auditLog.create({
      data: {
        action: "GITHUB_GUIDE_ARCHIVED",
        entityType: "Guide",
        entityId: guide.id,
        metadata: { repository, path, commit, slug: guide.slug },
      },
    }),
  ]);
  revalidateGuidePaths(guide.slug);
  return { action: "archived", slug: guide.slug, path };
}

function revalidateGuidePaths(slug: string, networkSlug?: string) {
  revalidatePath("/");
  revalidatePath("/guides");
  revalidatePath("/networks");
  revalidatePath("/testnets");
  revalidatePath("/mainnets");
  revalidatePath("/categories");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/guides/${slug}`);
  if (networkSlug) revalidatePath(`/networks/${networkSlug}`);
}

async function syncGuide(repository: string, commit: string, path: string) {
  const expectedSlug = publisherPathToSlug(path);
  if (!expectedSlug) return { action: "ignored-path", path };

  const markdown = await readAtCommit(repository, commit, path);
  const { data, body } = parsePublisherMarkdown(markdown);
  if (data.slug !== expectedSlug) {
    throw new Error(`Frontmatter slug "${data.slug}" must match filename "${expectedSlug}".`);
  }

  const publicationStatus = data.published
    ? PublicationStatus.PUBLISHED
    : PublicationStatus.DRAFT;
  const verifiedAt = data.verifiedAt ? new Date(data.verifiedAt) : null;

  const result = await prisma.$transaction(async (tx) => {
    const [category, existingNetwork, existingBySource, slugOwner] = await Promise.all([
      tx.category.upsert({
        where: { slug: data.categorySlug },
        update: {},
        create: {
          name: data.categoryName ?? data.categorySlug.replace(/-/g, " "),
          slug: data.categorySlug,
          description: data.categoryDescription,
          displayOrder: 99,
        },
        select: { id: true },
      }),
      tx.network.findUnique({ where: { slug: data.network.slug }, select: { id: true } }),
      tx.guide.findUnique({
        where: { githubRepository_githubPath: { githubRepository: repository, githubPath: path } },
        select: { id: true, slug: true },
      }),
      tx.guide.findUnique({ where: { slug: data.slug }, select: { id: true, githubRepository: true, githubPath: true } }),
    ]);

    if (slugOwner && (!existingBySource || slugOwner.id !== existingBySource.id)) {
      throw new Error(`Slug "${data.slug}" is already used by a non-publisher guide.`);
    }

    const network = existingNetwork ?? await tx.network.create({
      data: {
        name: data.network.name,
        slug: data.network.slug,
        symbol: data.network.symbol,
        chainId: data.network.chainId,
        networkType: data.network.networkType,
        category: data.network.category,
        layer: data.network.layer,
        consensus: data.network.consensus,
        status: NetworkStatus.ACTIVE,
        websiteUrl: data.network.websiteUrl,
        docsUrl: data.network.docsUrl,
        githubUrl: data.network.githubUrl,
        explorerUrl: data.network.explorerUrl,
        logoUrl: data.network.logoUrl,
      },
      select: { id: true },
    });

    const sourceRecords = await Promise.all(data.sources.map((source) =>
      tx.source.upsert({
        where: { url: source.url },
        update: { name: source.name, sourceType: source.sourceType, lastAccessedAt: new Date() },
        create: {
          name: source.name,
          url: source.url,
          sourceType: source.sourceType,
          reliabilityScore: 100,
          lastAccessedAt: new Date(),
        },
        select: { id: true },
      })
    ));

    const guideData = {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: body,
      difficulty: data.difficulty,
      estimatedMinutes: data.estimatedMinutes,
      categoryId: category.id,
      logoUrl: data.logoUrl,
      verificationStatus: data.verificationStatus,
      publicationStatus,
      verifiedAt,
      githubRepository: repository,
      githubPath: path,
      githubCommit: commit,
    };

    const relations = {
      guideNetworks: { create: { networkId: network.id, isPrimary: true } },
      guideSources: {
        create: sourceRecords.map((source, index) => ({
          sourceId: source.id,
          notes: data.sources[index]?.notes ?? `Imported from ${repository}/${path}`,
        })),
      },
    };

    const guide = existingBySource
      ? await tx.guide.update({
          where: { id: existingBySource.id },
          data: {
            ...guideData,
            guideNetworks: { deleteMany: {}, ...relations.guideNetworks },
            guideSources: { deleteMany: {}, ...relations.guideSources },
          },
          select: { id: true, slug: true, title: true, publicationStatus: true },
        })
      : await tx.guide.create({
          data: { ...guideData, ...relations },
          select: { id: true, slug: true, title: true, publicationStatus: true },
        });

    await tx.auditLog.create({
      data: {
        action: existingBySource ? "GITHUB_GUIDE_UPDATED" : "GITHUB_GUIDE_IMPORTED",
        entityType: "Guide",
        entityId: guide.id,
        metadata: {
          repository, path, commit, networkSlug: data.network.slug,
          categorySlug: data.categorySlug, published: data.published,
          verificationStatus: data.verificationStatus,
        },
      },
    });

    return { guide, networkSlug: data.network.slug };
  });

  revalidateGuidePaths(result.guide.slug, result.networkSlug);
  return {
    action: result.guide.publicationStatus === PublicationStatus.PUBLISHED ? "published" : "draft",
    title: result.guide.title,
    slug: result.guide.slug,
    path,
  };
}

export async function processGitHubPublisherPayload(payload: GitHubPublishPayload) {
  const allowedRepository = process.env.NODEDROPS_GITHUB_REPOSITORY;
  if (!allowedRepository || payload.repository !== allowedRepository) {
    throw new Error("Repository is not configured/allowlisted for NodeDrops publishing.");
  }
  if (!/^[0-9a-f]{40}$/i.test(payload.commit)) throw new Error("Invalid commit SHA.");
  if (!Array.isArray(payload.files) || payload.files.length > 30) throw new Error("Maximum 30 changed files per delivery.");

  const results = [];
  for (const file of payload.files) {
    if (!file || typeof file.path !== "string" || !publisherPathToSlug(file.path)) {
      results.push({ action: "ignored-path", path: file?.path ?? "unknown" });
      continue;
    }
    if (file.status === "deleted") {
      results.push(await archiveDeletedGuide(payload.repository, file.path, payload.commit));
    } else if (file.status === "upsert") {
      results.push(await syncGuide(payload.repository, payload.commit, file.path));
    } else {
      throw new Error(`Unsupported file status for ${file.path}`);
    }
  }
  return results;
}
