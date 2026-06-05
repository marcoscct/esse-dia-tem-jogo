import { MetadataRoute } from 'next';
import { getAllTeamSlugs, getAllStaticRoutes } from '@/lib/calendar';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.essediatemjogo.com.br';
  const currentDate = new Date();

  // 1. Static and compliance pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/devlog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/termos-de-uso`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 2. Team landing pages (e.g., /brasil, /flamengo)
  const teamSlugs = getAllTeamSlugs();
  const teamPages: MetadataRoute.Sitemap = teamSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 3. Match day pages (e.g., /brasil/2026-06-13)
  const staticRoutes = getAllStaticRoutes();
  const datePages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}/${route.team}/${route.date}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...teamPages, ...datePages];
}
