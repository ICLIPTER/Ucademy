import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";

export type AdminUserType = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
  enrollments: number;
  completedLessons: number;
  spent: number;
};

/**
 * The learner directory for the admin "Users" page.
 *
 * Enrolment and spend are aggregated in a single grouped query instead of
 * one query per user, which keeps the page fast as the user base grows.
 */
export async function adminGetUsers({
  query,
  page = 1,
  pageSize = 12,
}: { query?: string; page?: number; pageSize?: number } = {}) {
  await requireAdmin();

  const safePage = Math.max(1, page);
  const safeSize = Math.min(50, Math.max(1, pageSize));

  const where: Record<string, unknown> = {};

  if (query?.trim()) {
    const term = query.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * safeSize,
      take: safeSize,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        banned: true,
        createdAt: true,
        enrollment: {
          where: { status: "Active" },
          select: { amount: true },
        },
        lessonProgress: {
          where: { completed: true },
          select: { id: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const rows: AdminUserType[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    banned: user.banned,
    createdAt: user.createdAt,
    enrollments: user.enrollment.length,
    completedLessons: user.lessonProgress.length,
    spent: user.enrollment.reduce((sum, enrollment) => sum + enrollment.amount, 0),
  }));

  return {
    users: rows,
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  };
}
