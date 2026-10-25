import prisma from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";

export interface CreateSubmissionInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
}

export async function createContactSubmission(data: CreateSubmissionInput) {
  return prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ipAddress: data.ipAddress,
      status: SubmissionStatus.PENDING,
    },
  });
}

export async function getPendingSubmissions() {
  return prisma.contactSubmission.findMany({
    where: { status: SubmissionStatus.PENDING },
    orderBy: { createdAt: "desc" },
  });
}
