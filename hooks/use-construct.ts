"use client";

import { getPublicAssetUrl } from "@/lib/storage-url";

/**
 * Builds the public URL of an object-storage asset.
 *
 * Kept as a hook for backwards compatibility with the existing call sites —
 * it has no state of its own, so the URL is stable across renders.
 */
export function useConstructUrl(key: string): string {
  return getPublicAssetUrl(key);
}
