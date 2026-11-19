import { z } from "zod";
import {
  Difficulty,
  NetworkStatus,
  NetworkType,
  PublicationStatus,
  SourceType,
  VerificationStatus,
} from "@prisma/client";

const httpsUrl = z.string().url().refine((value) => value.startsWith("https://"), "URLs must use HTTPS.");

const PublisherFrontmatterSchema = z.object({
  title: z.string().trim().min(5).max(180),
  slug: z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(10).max(2000),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.INTERMEDIATE),
  estimatedMinutes: z.number().int().min(5).max(480).default(45),
  categorySlug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryName: z.string().trim().min(2).max(80).optional(),
  categoryDescription: z.string().trim().max(1000).optional(),
  published: z.boolean().default(false),
  verificationStatus: z.nativeEnum(VerificationStatus).default(VerificationStatus.UNDER_REVIEW),
  verifiedAt: z.string().datetime().optional(),
  logoUrl: httpsUrl.optional(),
  network: z.object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    symbol: z.string().trim().min(1).max(10).transform((v) => v.toUpperCase()).default("NATIVE"),
    chainId: z.string().trim().max(80).optional(),
    networkType: z.nativeEnum(NetworkType),
    category: z.string().trim().min(2).max(80).default("Layer 1"),
    layer: z.string().trim().min(2).max(80).default("Layer 1"),
    consensus: z.string().trim().min(2).max(120).default("Unknown / not specified"),
    websiteUrl: httpsUrl.optional(),
    docsUrl: httpsUrl.optional(),
    githubUrl: httpsUrl.optional(),
    explorerUrl: httpsUrl.optional(),
    logoUrl: httpsUrl.optional(),
  }),
  sources: z.array(z.object({
    name: z.string().trim().min(2).max(160),
    url: httpsUrl,
    sourceType: z.nativeEnum(SourceType).default(SourceType.OFFICIAL_DOCS),
    notes: z.string().trim().max(500).optional(),
  })).min(1).max(20),
});

export type PublisherGuide = z.infer<typeof PublisherFrontmatterSchema>;

function parseScalar(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null" || trimmed === "~") return undefined;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try { return JSON.parse(trimmed); } catch { return trimmed.slice(1, -1); }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replace(/''/g, "'");
  return trimmed.replace(/\s+#.*$/, "").trim();
}

/** Parses the intentionally small, documented YAML frontmatter subset used by NodeDrops content files. */
function parseFrontmatterYaml(raw: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let section: "root" | "network" | "sources" = "root";
  let currentSource: Record<string, unknown> | null = null;

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^network:\s*$/.test(line)) { section = "network"; continue; }
    if (/^sources:\s*$/.test(line)) { section = "sources"; root.sources = []; currentSource = null; continue; }

    if (section === "sources" && /^\s*-\s+/.test(line)) {
      currentSource = {};
      (root.sources as Record<string, unknown>[]).push(currentSource);
      const item = line.replace(/^\s*-\s+/, "");
      const match = item.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
      if (match) currentSource[match[1]] = parseScalar(match[2]);
      continue;
    }

    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    const match = line.trim().match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (section === "network" && indent >= 2) {
      const network = (root.network ??= {}) as Record<string, unknown>;
      network[key] = parseScalar(value);
    } else if (section === "sources" && indent >= 2 && currentSource) {
      currentSource[key] = parseScalar(value);
    } else if (indent === 0) {
      section = "root";
      root[key] = parseScalar(value);
    }
  }
  return root;
}

export function parsePublisherMarkdown(markdown: string): { data: PublisherGuide; body: string } {
  if (markdown.length > 750_000) throw new Error("Markdown guide exceeds 750 KB.");
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) throw new Error("File must begin with YAML frontmatter between --- delimiters.");
  const frontmatter = parseFrontmatterYaml(match[1]);
  const parsed = PublisherFrontmatterSchema.safeParse(frontmatter);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; "));
  }
  const body = match[2].trim();
  if (body.length < 20) throw new Error("Guide Markdown body must contain at least 20 characters.");
  return { data: parsed.data, body };
}

export function publisherPathToSlug(path: string): string | null {
  const match = path.match(/^content\/guides\/([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/);
  return match?.[1] ?? null;
}

export { NetworkStatus, PublicationStatus };
