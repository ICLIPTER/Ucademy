import "server-only";
import { requireUser } from "../user/require_user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getLessonContent(lessonId: string) {
  const session = await requireUser();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      chapter: {
        select: {
            courseId: true,
        }
      }
    },
  });

  if (!lesson) {
    return notFound();
  }
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        userId: session.id,
        courseId: lesson.chapter.courseId,
      },
    },
    select: {
        status: true,
    },
  });

  if(!enrollment || enrollment.status !== "Active") {
    return notFound();
  }
  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;