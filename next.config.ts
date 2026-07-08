import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Clean URLs
  // trailingSlash: true, 

  // Image optimization settings
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "s.sde.globo.com" },
      { protocol: "https", hostname: "hatscripts.github.io" }
    ]
  },

  // Cache static JSON data files aggressively on edge and client
  async headers() {
    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin'
      }
    ];

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
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
