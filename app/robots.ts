import type { MetadataRoute } from "next";

import { appUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = appUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private areas must never be indexed.
        disallow: ["/admin", "/dashboard", "/api/", "/payment/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
