"use server";

import { z } from "zod";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/rateLimit";

const ContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email address.")
    .max(150, "Email cannot exceed 150 characters.")
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters.")
    .max(150, "Subject cannot exceed 150 characters.")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(3000, "Message cannot exceed 3000 characters.")
    .trim(),
  // Honeypot field: must remain empty; bots fill it automatically
  website: z.string().optional(),
});

export type ContactFormState = {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
};

export async function submitContactAction(
  prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  try {
    const rawData = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      subject: (formData.get("subject") as string) || "",
      message: (formData.get("message") as string) || "",
      website: (formData.get("website") as string) || "",
    };

    // 1. Honeypot check for automated bot submissions
    if (rawData.website && rawData.website.trim().length > 0) {
      // Deceptive success response: bot thinks submission succeeded, but nothing is written to DB
      return {
        success: true,
        message: "Thank you for reaching out. Your message has been received.",
      };
    }

    // 2. Validate input schema
    const validated = ContactSchema.safeParse(rawData);
    if (!validated.success) {
      const fieldErrors: ContactFormState["fieldErrors"] = {};
      for (const issue of validated.error.issues) {
        const fieldName = issue.path[0] as keyof NonNullable<ContactFormState["fieldErrors"]>;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }

      return {
        success: false,
        error: "Please correct the highlighted errors in the form.",
        fieldErrors,
      };
    }

    const { name, email, subject, message } = validated.data;

    // 3. Resolve client IP address for abuse protection
    let ipAddress = "127.0.0.1";
    try {
      const headerList = await headers();
      const forwardedFor = headerList.get("x-forwarded-for");
      if (forwardedFor) {
        ipAddress = forwardedFor.split(",")[0].trim();
      }
    } catch {
      // Graceful fallback when executed outside active Next.js request context (e.g. test scripts)
      ipAddress = "127.0.0.1";
    }

    // 4. Rate Limiting Check (keyed by email + IP)
    const rateLimitKey = `contact:${email}:${ipAddress}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Too many submissions received. Please wait ${rateLimit.remainingSeconds ?? 60} seconds before sending another message.`,
      };
    }

    // 5. Safe Persistence into MySQL
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
        status: SubmissionStatus.PENDING,
        ipAddress,
      },
    });

    if (!submission || !submission.id) {
      recordFailedAttempt(rateLimitKey);
      return {
        success: false,
        error: "An unexpected error occurred while saving your inquiry. Please try again later.",
      };
    }

    // Record submission count for rate limiting (max 5 per window)
    recordFailedAttempt(rateLimitKey);

    return {
      success: true,
      message:
        "Your message has been safely logged in our review queue. Our engineering team reviews technical inquiries and content errata regularly.",
    };
  } catch (error) {
    console.error("Error processing contact submission:", error);
    return {
      success: false,
      error: "Unable to process message at this time. Please try again in a few minutes.",
    };
  }
}
