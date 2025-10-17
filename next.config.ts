import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images : {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucademy.t3.storage.dev",
        port : "",
      }
    ]
  }
};

export default nextConfig;
