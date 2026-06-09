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

  // Cache static JSON data files aggressively on edge and client
  async headers() {
    return [
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
    ];
  },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
