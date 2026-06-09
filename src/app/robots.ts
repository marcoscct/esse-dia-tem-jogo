import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.essediatemjogo.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "Anthropic-AI",
          "Claude-Web",
          "ClaudeBot",
          "cohere-ai",
          "Omgilibot",
          "PerplexityBot",
          "YouBot",
          "FacebookBot",
          "Bytespider",
          "Diffbot",
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
