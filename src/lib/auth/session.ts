import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

const COOKIE_NAME = "nodedrops_admin_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Secure fallback secret for local development; production must specify SESSION_SECRET
const SESSION_SECRET =
  process.env.SESSION_SECRET || "nodedrops-dev-session-secret-change-in-production-min32chars";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface SessionPayload {
  uid: string;
  email: string;
  name: string;
  role: Role;
  iat: number;
  exp: number;
}

export function signPayload(payload: SessionPayload): string {
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return null;

    const expectedSig = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadB64)
      .digest("base64url");

    // Constant-time signature comparison
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    if (Date.now() > payload.exp * 1000) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createAdminSession(user: {
  id: string;
  email: string;
  name: string;
  role: Role;
}): Promise<void> {
  const nowSec = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    uid: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: nowSec,
    exp: nowSec + SESSION_MAX_AGE_SECONDS,
  };

  const token = signPayload(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;

    const payload = verifyToken(sessionCookie.value);
    if (!payload) return null;

    // Verify user is still active in database
    const user = await prisma.user.findUnique({
      where: { id: payload.uid },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      error.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    return null;
  }
}

/**
 * Server-side guard for protected Admin pages.
 * Redirects to /admin/login if not authenticated or lacking privileges.
 */
export async function requireAdmin(returnUrl?: string): Promise<SessionUser> {
  const session = await getSession();

  if (!session || (session.role !== Role.ADMIN && session.role !== Role.EDITOR)) {
    const query = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : "";
    redirect(`/admin/login${query}`);
  }

  return session;
}

/**
 * Server-side authorization check for Server Actions & API mutations.
 * Throws an Error if unauthorized, preventing action execution.
 */
export async function requireAdminAction(): Promise<SessionUser> {
  const session = await getSession();

  if (!session || (session.role !== Role.ADMIN && session.role !== Role.EDITOR)) {
    throw new Error("Unauthorized: Administrative privilege required.");
  }

  return session;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
