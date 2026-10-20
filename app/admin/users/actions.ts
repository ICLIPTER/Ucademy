"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

/**
 * Changes a learner's role.
 *
 * An administrator can never change their own role — that is the simplest
 * way to guarantee the platform can never be locked out of its own admin
 * area.
 */
export async function updateUserRoleAction(
  userId: string,
  role: "user" | "admin",
): Promise<ApiResponse> {
  const admin = await requireAdmin();

  const allowed = await allowAction({
    scope: "update-role",
    userId: admin.user.id,
    limit: 30,
    windowSeconds: 60,
  });

  if (!allowed) {
    return { status: "error", message: "Slow down a moment, please." };
  }

  if (admin.user.id === userId) {
    return {
      status: "error",
      message: "You cannot change your own role.",
    };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");

    return { status: "success", message: "Role updated." };
  } catch (error) {
    console.error("[admin] Failed to update user role:", error);
    return { status: "error", message: "Could not update that user." };
  }
}

/**
 * Bans or unbans a learner.
 */
export async function toggleUserBanAction(
  userId: string,
  reason?: string,
): Promise<ApiResponse> {
  const admin = await requireAdmin();

  const allowed = await allowAction({
    scope: "toggle-ban",
    userId: admin.user.id,
    limit: 30,
    windowSeconds: 60,
  });

  if (!allowed) {
    return { status: "error", message: "Slow down a moment, please." };
  }

  if (admin.user.id === userId) {
    return { status: "error", message: "You cannot ban yourself." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { banned: true },
    });

    if (!user) {
      return { status: "error", message: "User not found." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        banned: !user.banned,
        banReason: user.banned ? null : (reason ?? "Policy violation"),
      },
    });

    revalidatePath("/admin/users");

    return {
      status: "success",
      message: user.banned ? "User reinstated." : "User suspended.",
    };
  } catch (error) {
    console.error("[admin] Failed to toggle ban:", error);
    return { status: "error", message: "Could not update that user." };
  }
}
