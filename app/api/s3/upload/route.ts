import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { requireAdminApi } from "@/app/data/admin/require-admin-api";
import { rateLimit, requestFingerprint } from "@/lib/rate-limit";
import { S3, STORAGE_BUCKET, STORAGE_PREFIX } from "@/lib/S3Client";

/**
 * Issues a pre-signed PUT URL so the browser uploads media directly to
 * object storage — the application server never proxies the bytes, which
 * keeps it fast and keeps the serverless function bill small.
 *
 * The client-declared size and content type are validated *server-side*:
 * the browser-side limits in the uploader are a convenience, not a control.
 */

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
] as const;

const uploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1).max(120),
  size: z.number().int().positive(),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  const admin = await requireAdminApi();

  if (!admin) {
    return NextResponse.json(
      { error: "You are not allowed to upload files." },
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
    key: `s3:upload:${requestFingerprint(request, admin.id)}`,
    limit: 30,
    windowSeconds: 60,
  });

  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many upload requests. Please slow down." },
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

  const validation = uploadSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 },
    );
  }

  const { fileName, contentType, size, isImage } = validation.data;

  // --- Content type allow-list ------------------------------------------
  if (isImage) {
    if (!ALLOWED_IMAGE_TYPES.includes(contentType as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      return NextResponse.json(
        { error: `Unsupported image type "${contentType}".` },
        { status: 400 },
      );
    }
    if (size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Images must be 5 MB or smaller." },
        { status: 413 },
      );
    }
  } else {
    if (!ALLOWED_VIDEO_TYPES.includes(contentType as (typeof ALLOWED_VIDEO_TYPES)[number])) {
      return NextResponse.json(
        { error: `Unsupported video type "${contentType}".` },
        { status: 400 },
      );
    }
    if (size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "Videos must be 5 GB or smaller." },
        { status: 413 },
      );
    }
  }

  const prefix = isImage ? STORAGE_PREFIX.course : STORAGE_PREFIX.video;
  const key = `${prefix}/${uuidv4()}-${encodeURIComponent(fileName)}`;

  try {
    const command = new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 600, // 10 minutes
    });

    return NextResponse.json({ presignedUrl, key });
  } catch (error) {
    console.error("[s3] Failed to create presigned URL:", error);
    return NextResponse.json(
      { error: "Could not prepare the upload. Please try again." },
      { status: 500 },
    );
  }
}
