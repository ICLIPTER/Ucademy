/**
 * Storage configuration — the single source of truth.
 *
 * This module is imported by BOTH:
 *   - `next.config.ts`, to build `images.remotePatterns`
 *   - `lib/storage-url.ts`, to build the URL passed to `next/image`
 *
 * It must therefore only depend on `NEXT_PUBLIC_*` variables, which are
 * inlined identically in the browser bundle and readable from the config
 * file. Reading a server-only variable here would make the two sides derive
 * different hosts — which is exactly how `next/image` ended up rejecting
 * perfectly valid URLs.
 */

/** The bucket that serves course thumbnails, lesson images and videos. */
export const STORAGE_BUCKET = (
  process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES || "ucademy"
).trim();

/**
 * Public base URL that serves the bucket.
 *
 * - `NEXT_PUBLIC_STORAGE_BASE_URL` wins when it is set (Cloudflare R2,
 *   an AWS CloudFront domain, a CDN…).
 * - Otherwise the virtual-hosted style used by T3 Storage is assumed:
 *   `https://<bucket>.t3.storage.dev`.
 */
export const PUBLIC_ASSET_BASE_URL = (
  process.env.NEXT_PUBLIC_STORAGE_BASE_URL?.trim() ||
  `https://${STORAGE_BUCKET}.t3.storage.dev`
).replace(/\/+$/, "");

export type StorageHost = {
  protocol: "http" | "https";
  hostname: string;
};

function hostOf(url: string): StorageHost | null {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
    };
  } catch {
    return null;
  }
}

/**
 * Every host that may legitimately serve a public asset.
 *
 * Both the virtual-hosted form (`bucket.t3.storage.dev`) and the path-style
 * form (`t3.storage.dev/bucket`) are included, because different S3-compatible
 * providers expose the bucket under different names.
 */
export const STORAGE_HOSTS: StorageHost[] = Array.from(
  new Map(
    [
      hostOf(PUBLIC_ASSET_BASE_URL),
      hostOf(`https://${STORAGE_BUCKET}.t3.storage.dev`),
      hostOf(`https://t3.storage.dev`),
    ]
      .filter((host): host is StorageHost => host !== null)
      .map((host) => [host.hostname, host]),
  ).values(),
);
