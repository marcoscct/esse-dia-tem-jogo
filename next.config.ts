import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Clean URLs
  // trailingSlash: true, 

  // Image optimization settings
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s.sde.globo.com" },
      { protocol: "https", hostname: "hatscripts.github.io" }
    ]
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
