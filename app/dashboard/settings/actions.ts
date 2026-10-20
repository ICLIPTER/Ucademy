"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/app/data/user/require_user";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { profileSchema, ProfileSchemaType } from "@/lib/zodSchemas";

/**
 * Updates the caller's profile.
 */
export async function updateProfileAction(
  values: ProfileSchemaType,
): Promise<ApiResponse> {
  const user = await requireUser();

  const allowed = await allowAction({
    scope: "update-profile",
    userId: user.id,
    limit: 20,
    windowSeconds: 300,
  });

  if (!allowed) {
    return { status: "error", message: "Slow down a moment, please." };
  }

  const result = profileSchema.safeParse(values);

  if (!result.success) {
    const first = result.error.issues[0];
    return {
      status: "error",
      message: first?.message ?? "Invalid profile.",
      fields: first?.path.length
        ? { [String(first.path[0])]: first.message }
        : undefined,
    };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: result.data.name,
        jobTitle: result.data.jobTitle || null,
        bio: result.data.bio || null,
      },
    });

    revalidatePath("/dashboard/settings");

    return { status: "success", message: "Profile updated." };
  } catch (error) {
    console.error("[profile] Failed to update profile:", error);
    return { status: "error", message: "Could not save your profile." };
  }
}

/**
 * Permanently deletes the caller's account and all associated data.
 */
export async function deleteAccountAction(): Promise<ApiResponse> {
  const user = await requireUser();

  const allowed = await allowAction({
    scope: "delete-account",
    userId: user.id,
    limit: 3,
    windowSeconds: 3600,
  });

  if (!allowed) {
    return { status: "error", message: "Please try again in a few minutes." };
  }

  try {
    await prisma.user.delete({ where: { id: user.id } });

    return {
      status: "success",
      message: "Your account has been deleted.",
      redirectTo: "/",
    };
  } catch (error) {
    console.error("[profile] Failed to delete account:", error);
    return { status: "error", message: "Could not delete your account." };
  }
}
