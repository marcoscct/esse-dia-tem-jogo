import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Cloudflare Pages / Vercel static hosting
  output: "export",

  // Clean URLs: /brasil instead of /brasil.html
  trailingSlash: true,

  // Required for static export — disable server-side image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
