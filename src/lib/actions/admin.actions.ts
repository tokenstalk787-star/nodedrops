"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession, logoutAdmin, requireAdminAction, getSession } from "@/lib/auth/session";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "@/lib/auth/rateLimit";
import { createAuditLog } from "@/lib/repositories/audit.repository";
import {
  Role,
  NetworkStatus,
  NetworkType,
  PublicationStatus,
  VerificationStatus,
  Difficulty,
  SourceType,
  SubmissionStatus,
} from "@prisma/client";

// ============================================================================
// 1. AUTHENTICATION ACTIONS
// ============================================================================

const LoginSchema = z.object({
  email: z.string().email("Please provide a valid email address.").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  returnUrl: z.string().optional(),
});

export async function loginAdminAction(
  prevState: { error?: string; success?: boolean; redirectUrl?: string } | null,
  formData: FormData
) {
  const rawEmail = (formData.get("email") as string) || "";
  const rawPassword = (formData.get("password") as string) || "";
  const rawReturnUrl = (formData.get("returnUrl") as string) || "/admin";

  const validated = LoginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
    returnUrl: rawReturnUrl,
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Invalid credentials format." };
  }

  const { email, password, returnUrl } = validated.data;

  // Rate Limiting Check
  const rateLimit = checkRateLimit(email);
  if (!rateLimit.allowed) {
    return {
      error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateLimit.remainingSeconds} seconds.`,
    };
  }

  // User Lookup
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    recordFailedAttempt(email);
    return { error: "Invalid email or administrative password." };
  }

  if (user.role !== Role.ADMIN && user.role !== Role.EDITOR) {
    recordFailedAttempt(email);
    return { error: "Access denied: User does not possess administrative privileges." };
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    recordFailedAttempt(email);
    return { error: "Invalid email or administrative password." };
  }

  // Reset rate limiting on success
  resetRateLimit(email);

  // Set secure HTTP-only session cookie
  await createAdminSession(user);

  // Log successful audit login
  await createAuditLog({
    userId: user.id,
    action: "ADMIN_LOGIN_SUCCESS",
    entityType: "User",
    entityId: user.id,
    metadata: { email: user.email, role: user.role },
  });

  // Open Redirect Protection: Only allow redirects to internal /admin paths
  let safeDestination = "/admin";
  if (returnUrl && returnUrl.startsWith("/admin") && !returnUrl.includes("//") && !returnUrl.includes("\\")) {
    safeDestination = returnUrl;
  }

  return { success: true, redirectUrl: safeDestination };
}

export async function logoutAction() {
  const session = await getSession();
  if (session) {
    await createAuditLog({
      userId: session.id,
      action: "ADMIN_LOGOUT",
      entityType: "User",
      entityId: session.id,
    });
  }
  await logoutAdmin();
  redirect("/admin/login");
}

// ============================================================================
// 2. NETWORK CMS ACTIONS
// ============================================================================

export async function updateNetworkStatusAction(networkId: string, newStatus: NetworkStatus) {
  const session = await requireAdminAction();

  const network = await prisma.network.update({
    where: { id: networkId },
    data: { status: newStatus },
  });

  await createAuditLog({
    userId: session.id,
    action: "NETWORK_STATUS_UPDATED",
    entityType: "Network",
    entityId: network.id,
    metadata: { previousStatus: network.status, newStatus, networkSlug: network.slug },
  });

  revalidatePath("/admin/networks");
  revalidatePath("/admin");
  revalidatePath("/networks");
  revalidatePath(`/networks/${network.slug}`);

  return { success: true, status: network.status };
}

const CreateNetworkSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").trim(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes.").trim(),
  symbol: z.string().min(1).max(10).toUpperCase().trim(),
  chainId: z.string().optional(),
  networkType: z.nativeEnum(NetworkType),
  category: z.string().min(2).trim(),
  layer: z.string().min(2).trim(),
  consensus: z.string().min(2).trim(),
  status: z.nativeEnum(NetworkStatus).default(NetworkStatus.ACTIVE),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  docsUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  explorerUrl: z.string().url().optional().or(z.literal("")),
  rpcUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
});

export async function createNetworkAction(formData: FormData) {
  const session = await requireAdminAction();

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    symbol: formData.get("symbol"),
    chainId: formData.get("chainId") || undefined,
    networkType: formData.get("networkType"),
    category: formData.get("category"),
    layer: formData.get("layer"),
    consensus: formData.get("consensus"),
    status: formData.get("status") || NetworkStatus.ACTIVE,
    websiteUrl: formData.get("websiteUrl") || undefined,
    docsUrl: formData.get("docsUrl") || undefined,
    githubUrl: formData.get("githubUrl") || undefined,
    explorerUrl: formData.get("explorerUrl") || undefined,
    rpcUrl: formData.get("rpcUrl") || undefined,
    isFeatured: formData.get("isFeatured") === "true",
  };

  const parsed = CreateNetworkSchema.parse(raw);

  const network = await prisma.network.create({
    data: {
      ...parsed,
      websiteUrl: parsed.websiteUrl || null,
      docsUrl: parsed.docsUrl || null,
      githubUrl: parsed.githubUrl || null,
      explorerUrl: parsed.explorerUrl || null,
      rpcUrl: parsed.rpcUrl || null,
    },
  });

  await createAuditLog({
    userId: session.id,
    action: "NETWORK_CREATED",
    entityType: "Network",
    entityId: network.id,
    metadata: { name: network.name, slug: network.slug },
  });

  revalidatePath("/admin/networks");
  revalidatePath("/admin");
  revalidatePath("/networks");

  return { success: true, networkId: network.id };
}

// ============================================================================
// 3. GUIDE RUNBOOK ACTIONS
// ============================================================================

export async function toggleGuidePublicationAction(guideId: string, newStatus: PublicationStatus) {
  const session = await requireAdminAction();

  const guide = await prisma.guide.update({
    where: { id: guideId },
    data: { publicationStatus: newStatus },
  });

  await createAuditLog({
    userId: session.id,
    action: "GUIDE_PUBLICATION_STATUS_CHANGED",
    entityType: "Guide",
    entityId: guide.id,
    metadata: { slug: guide.slug, newStatus },
  });

  revalidatePath("/admin/guides");
  revalidatePath("/admin");
  revalidatePath("/guides");
  revalidatePath(`/guides/${guide.slug}`);

  return { success: true, status: guide.publicationStatus };
}

const CreateGuideSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").trim(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes.").trim(),
  summary: z.string().min(10, "Summary must be at least 10 characters.").trim(),
  content: z.string().min(20, "Content must be at least 20 characters."),
  difficulty: z.nativeEnum(Difficulty),
  estimatedMinutes: z.coerce.number().min(5).max(480),
  categoryId: z.string().min(1, "Please select a category."),
  networkId: z.string().min(1, "Please link a target network."),
  sourceId: z.string().optional(),
  verificationStatus: z.nativeEnum(VerificationStatus).default(VerificationStatus.OFFICIAL_DOCS_VERIFIED),
  publicationStatus: z.nativeEnum(PublicationStatus).default(PublicationStatus.DRAFT),
});

export async function createGuideAction(formData: FormData) {
  const session = await requireAdminAction();

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    difficulty: formData.get("difficulty"),
    estimatedMinutes: formData.get("estimatedMinutes"),
    categoryId: formData.get("categoryId"),
    networkId: formData.get("networkId"),
    sourceId: formData.get("sourceId") || undefined,
    verificationStatus: formData.get("verificationStatus") || VerificationStatus.OFFICIAL_DOCS_VERIFIED,
    publicationStatus: formData.get("publicationStatus") || PublicationStatus.DRAFT,
  };

  const parsed = CreateGuideSchema.parse(raw);

  const guide = await prisma.guide.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      summary: parsed.summary,
      content: parsed.content,
      difficulty: parsed.difficulty,
      estimatedMinutes: parsed.estimatedMinutes,
      categoryId: parsed.categoryId,
      authorId: session.id,
      verificationStatus: parsed.verificationStatus,
      publicationStatus: parsed.publicationStatus,
      verifiedAt: parsed.verificationStatus === VerificationStatus.SETUP_TESTED || parsed.verificationStatus === VerificationStatus.OFFICIAL_DOCS_VERIFIED ? new Date() : null,
      guideNetworks: {
        create: {
          networkId: parsed.networkId,
        },
      },
      guideSources: parsed.sourceId
        ? {
            create: {
              sourceId: parsed.sourceId,
              notes: "Primary upstream technical documentation reference.",
            },
          }
        : undefined,
    },
  });

  await createAuditLog({
    userId: session.id,
    action: "GUIDE_CREATED",
    entityType: "Guide",
    entityId: guide.id,
    metadata: { title: guide.title, slug: guide.slug, publicationStatus: guide.publicationStatus },
  });

  revalidatePath("/admin/guides");
  revalidatePath("/admin");
  revalidatePath("/guides");
  revalidatePath(`/guides/${guide.slug}`);

  redirect("/admin/guides");
}

// ============================================================================
// 4. CATEGORY & SOURCE CMS ACTIONS
// ============================================================================

const CreateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").trim(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).trim(),
  description: z.string().min(5).trim(),
  displayOrder: z.coerce.number().default(0),
});

export async function createCategoryAction(formData: FormData) {
  const session = await requireAdminAction();

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    displayOrder: formData.get("displayOrder") || 0,
  };

  const parsed = CreateCategorySchema.parse(raw);

  const category = await prisma.category.create({
    data: parsed,
  });

  await createAuditLog({
    userId: session.id,
    action: "CATEGORY_CREATED",
    entityType: "Category",
    entityId: category.id,
    metadata: { name: category.name, slug: category.slug },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/categories");

  return { success: true, categoryId: category.id };
}

const CreateSourceSchema = z.object({
  name: z.string().min(2).trim(),
  url: z.string().url("Please provide a valid documentation URL.").trim(),
  sourceType: z.nativeEnum(SourceType).default(SourceType.OFFICIAL_DOCS),
  reliabilityScore: z.coerce.number().min(0).max(100).default(100),
});

export async function createSourceAction(formData: FormData) {
  const session = await requireAdminAction();

  const raw = {
    name: formData.get("name"),
    url: formData.get("url"),
    sourceType: formData.get("sourceType"),
    reliabilityScore: formData.get("reliabilityScore"),
  };

  const parsed = CreateSourceSchema.parse(raw);

  const source = await prisma.source.create({
    data: parsed,
  });

  await createAuditLog({
    userId: session.id,
    action: "SOURCE_CREATED",
    entityType: "Source",
    entityId: source.id,
    metadata: { name: source.name, url: source.url },
  });

  revalidatePath("/admin/sources");
  revalidatePath("/admin");

  return { success: true, sourceId: source.id };
}

// ============================================================================
// 5. REVIEW & VERIFICATION ACTIONS
// ============================================================================

export async function markGuideVerifiedAction(guideId: string, status: VerificationStatus) {
  const session = await requireAdminAction();

  const guide = await prisma.guide.update({
    where: { id: guideId },
    data: {
      verificationStatus: status,
      verifiedAt: new Date(),
    },
  });

  await createAuditLog({
    userId: session.id,
    action: "GUIDE_VERIFIED",
    entityType: "Guide",
    entityId: guide.id,
    metadata: { slug: guide.slug, verificationStatus: status },
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  revalidatePath("/guides");
  revalidatePath(`/guides/${guide.slug}`);

  return { success: true, verifiedAt: guide.verifiedAt };
}

export async function updateSubmissionStatusAction(submissionId: string, status: SubmissionStatus) {
  const session = await requireAdminAction();

  const submission = await prisma.contactSubmission.update({
    where: { id: submissionId },
    data: { status },
  });

  await createAuditLog({
    userId: session.id,
    action: "CONTACT_SUBMISSION_STATUS_UPDATED",
    entityType: "ContactSubmission",
    entityId: submission.id,
    metadata: { status },
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/admin");

  return { success: true, status: submission.status };
}
