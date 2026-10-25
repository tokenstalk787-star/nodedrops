import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CreateAuditLogInput {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
}

export async function createAuditLog(data: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      metadata: data.metadata,
      ipAddress: data.ipAddress,
    },
  });
}

export async function getRecentAuditLogs(limit = 50) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}
