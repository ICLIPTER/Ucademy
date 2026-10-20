"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/app/data/user/require_user";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

/**
 * Issues a certificate for a completed course.
 *
 * The serial is a short, human-readable code so a certificate can be
 * verified by hand as well as through the app.
 */
export async function issueCertificateAction(
  courseId: string,
): Promise<ApiResponse> {
  const user = await requireUser();

  const allowed = await allowAction({
    scope: "issue-certificate",
    userId: user.id,
    limit: 20,
    windowSeconds: 3600,
  });

  if (!allowed) {
    return { status: "error", message: "Slow down a moment, please." };
  }

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { courseId_userId: { courseId, userId: user.id } },
      select: { status: true },
    });

    if (enrollment?.status !== "Active") {
      return {
        status: "error",
        message: "You need an active enrolment to claim a certificate.",
      };
    }

    const lessons = await prisma.lesson.findMany({
      where: { chapter: { courseId } },
      select: {
        id: true,
        lessonProgress: {
          where: { userId: user.id, completed: true },
          select: { id: true },
        },
      },
    });

    if (lessons.length === 0) {
      return { status: "error", message: "This course has no lessons yet." };
    }

    const completed = lessons.filter(
      (lesson) => lesson.lessonProgress.length > 0,
    ).length;

    if (completed < lessons.length) {
      return {
        status: "error",
        message: `Finish every lesson to claim your certificate (${completed}/${lessons.length} done).`,
      };
    }

    const serial = `UC-${randomSegment()}-${randomSegment()}`;

    const certificate = await prisma.certificate.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      create: {
        userId: user.id,
        courseId,
        serial,
        finalScore: 100,
      },
      update: {},
    });

    revalidatePath("/dashboard/certificates");

    return {
      status: "success",
      message: `Certificate ${certificate.serial} issued.`,
    };
  } catch (error) {
    console.error("[certificate] Failed to issue certificate:", error);
    return { status: "error", message: "Could not issue your certificate." };
  }
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(): string {
  let out = "";
  for (let index = 0; index < 4; index += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}
