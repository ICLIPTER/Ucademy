import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminApi } from "@/app/data/admin/require-admin-api";
import { rateLimit, requestFingerprint } from "@/lib/rate-limit";
import { isManagedObjectKey, S3, STORAGE_BUCKET } from "@/lib/S3Client";

/**
 * Removes an object from storage.
 *
 * Only keys inside the prefixes this application manages can be deleted, so
 * a compromised admin session cannot be used to remove unrelated objects
 * from the bucket.
 */

const deleteSchema = z.object({
  key: z.string().min(1).max(512),
});

export async function DELETE(request: Request) {
  const admin = await requireAdminApi();

  if (!admin) {
    return NextResponse.json(
      { error: "You are not allowed to delete files." },
      { status: 403 },
    );
  }

  if (!S3) {
    return NextResponse.json(
      { error: "File storage is not configured for this deployment." },
      { status: 503 },
    );
  }

  const limit = await rateLimit({
    key: `s3:delete:${requestFingerprint(request, admin.id)}`,
    limit: 30,
    windowSeconds: 60,
  });

  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many delete requests. Please slow down." },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const validation = deleteSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "A valid object key is required." },
      { status: 400 },
    );
  }

  const { key } = validation.data;

  if (!isManagedObjectKey(key)) {
    return NextResponse.json(
      { error: "That object key is not managed by this application." },
      { status: 400 },
    );
  }

  try {
    await S3.send(
      new DeleteObjectCommand({ Bucket: STORAGE_BUCKET, Key: key }),
    );

    return NextResponse.json({ message: "Object deleted successfully." });
  } catch (error) {
    console.error("[s3] Failed to delete object:", error);
    return NextResponse.json(
      { error: "Could not delete the file from storage." },
      { status: 500 },
    );
  }
}
