import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Clean URLs
  // trailingSlash: true, 

  // Image optimization settings
  images: {
    unoptimized: true,
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
