import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

/**
 * S3-compatible object storage client.
 *
 * Works with AWS S3, Cloudflare R2, MinIO and T3 Storage — anything that
 * speaks the S3 wire protocol. The endpoint + credentials are optional, so
 * the client is only constructed when they are actually configured. This
 * keeps `next build` working on deployments that have no storage attached.
 */
export const S3 = env.AWS_ENDPOINT_URL_S3
  ? new S3Client({
      region: env.AWS_REGION,
      endpoint: env.AWS_ENDPOINT_URL_S3,
      forcePathStyle: env.AWS_S3_FORCE_PATH_STYLE,
      credentials:
        env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: env.AWS_ACCESS_KEY_ID,
              secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    })
  : null;

/** Bucket used for course thumbnails, lesson thumbnails and lesson videos. */
export const STORAGE_BUCKET = env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

/** Object prefixes keep media types isolated so permissions can be scoped. */
export const STORAGE_PREFIX = {
  course: "courses",
  lesson: "lessons",
  video: "videos",
} as const;

export type StoragePrefix = (typeof STORAGE_PREFIX)[keyof typeof STORAGE_PREFIX];

/**
 * Builds a namespaced object key.
 * The UUID prefix makes keys unguessable and prevents path traversal.
 */
export function buildObjectKey(
  prefix: StoragePrefix,
  fileName: string,
  id: string,
): string {
  const safeName = encodeURIComponent(fileName).replace(/%/g, "_");
  return `${prefix}/${id}-${safeName}`;
}

/** True when the key belongs to one of our managed prefixes. */
export function isManagedObjectKey(key: string): boolean {
  return Object.values(STORAGE_PREFIX).some(
    (prefix) => key.startsWith(`${prefix}/`),
  );
}
