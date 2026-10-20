import type { NextConfig } from "next";

import { STORAGE_HOSTS } from "./lib/storage-config";

/**
 * Hosts that may serve a public asset.
 *
 * Three sources are unioned so the allow-list can never fall out of sync
 * with the URLs the app renders:
 *
 *  1. `STORAGE_HOSTS` — derived from the same module that builds the image
 *     URLs, so the two always agree.
 *  2. The configured S3 endpoint, because path-style providers serve the
 *     bucket from the bare endpoint host.
 *  3. A static safety net, so a renamed bucket (or an environment where the
 *     import above cannot be resolved) can never leave the storage host
 *     un-allow-listed and break every thumbnail on the site.
 */
function storageHosts(): { protocol: "http" | "https"; hostname: string }[] {
  const hosts: { protocol: "http" | "https"; hostname: string }[] = [
    ...STORAGE_HOSTS,
  ];

  const endpoint = process.env.AWS_ENDPOINT_URL_S3;

  if (endpoint) {
    try {
      const url = new URL(endpoint);
      hosts.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
      });
    } catch {
      // An unparseable endpoint is ignored — the other sources still apply.
    }
  }

  hosts.push({ protocol: "https", hostname: "t3.storage.dev" });

  return Array.from(new Map(hosts.map((host) => [host.hostname, host])).values());
}

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Do not advertise the framework.
  poweredByHeader: false,

  // Brotli + gzip for every response.
  compress: true,

  images: {
    // Modern formats first — ~30% smaller than the source for the same quality.
    formats: ["image/avif", "image/webp"],
    // Only the sizes the UI actually renders, so the optimiser never
    // generates an image that is never requested.
    deviceSizes: [400, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Let the CDN cache optimised variants for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: storageHosts().map((host) => ({
      protocol: host.protocol,
      hostname: host.hostname,
      port: "",
      pathname: "/**",
    })),
  },

  /**
   * Keeps the React Server Components payload small by rewriting barrel
   * imports of the two largest icon libraries into direct imports.
   */
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tabler/icons-react",
      "date-fns",
    ],
  },

  /**
   * Prisma must stay a real Node.js require — bundling it breaks the
   * native query engine.
   */
  serverExternalPackages: ["@prisma/client"],

  /**
   * Hardening headers. A Content-Security-Policy is intentionally not set
   * here: Stripe Checkout and the object-storage CDN both need to be allowed
   * explicitly, and a wrong policy breaks payments in production.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Immutable, content-hashed build output.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
