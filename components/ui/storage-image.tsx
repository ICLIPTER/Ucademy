"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";

/**
 * Custom image loader for object-storage assets.
 *
 * Next.js validates a remote `src` against `images.remotePatterns` inside
 * its **default** loader. That check runs in the browser, using the image
 * config that was serialised into the page — so a client holding a stale
 * config throws:
 *
 *   Invalid src prop (…) on `next/image`, hostname "…" is not configured
 *   under images in your `next.config.js`
 *
 * and takes the whole page down with a hydration error.
 *
 * Supplying a `loader` prop replaces the default loader entirely, so the
 * browser-side hostname check never runs. The **server**-side allow-list
 * still applies — the request goes through `/_next/image`, which refuses
 * hosts that are not in `images.remotePatterns`. The security control is
 * unchanged; only the brittle client-side crash is removed.
 *
 * The URL produced is byte-for-byte what Next's default loader produces, so
 * the images are still optimised (AVIF/WebP, resized, CDN-cached).
 */
export function storageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}

const REMOTE = /^https?:\/\//i;

/**
 * `next/image` for assets that live in object storage.
 *
 * Local assets (the logo, icons) keep Next's default loader; remote ones use
 * the custom loader above.
 */
export function StorageImage({
  src,
  alt,
  ...props
}: Omit<ImageProps, "loader" | "src"> & { src: string; alt: string }) {
  const isRemote = REMOTE.test(src);

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      loader={isRemote ? storageLoader : undefined}
    />
  );
}
