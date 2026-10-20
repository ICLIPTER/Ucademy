import {
  PUBLIC_ASSET_BASE_URL,
  STORAGE_BUCKET,
} from "@/lib/storage-config";

/**
 * Isomorphic helpers for building public asset URLs.
 *
 * The URL is derived from `lib/storage-config.ts`, which `next.config.ts`
 * also imports to build `images.remotePatterns`. Both sides therefore agree
 * on the host, and `next/image` never rejects a URL the app itself created.
 */
export { PUBLIC_ASSET_BASE_URL, STORAGE_BUCKET };

/**
 * Builds a public URL for an object-storage key.
 * Returns a stable placeholder when no key is available so `next/image`
 * never receives an empty `src`.
 */
export function getPublicAssetUrl(key?: string | null): string {
  if (!key) return "/icon.svg";
  const clean = key.replace(/^\/+/, "");
  return `${PUBLIC_ASSET_BASE_URL}/${clean}`;
}
