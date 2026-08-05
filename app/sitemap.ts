import type { MetadataRoute } from 'next';
import { getProductTemplates } from '@/lib/products';
import { SITE_URL } from '@/utils/environments';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/shipping`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const templates = await getProductTemplates();
    productRoutes = templates
      .filter((t) => t.is_active)
      .map((t) => ({
        url: `${SITE_URL}/product/${t.slug}`,
        lastModified: t.updated_at ? new Date(t.updated_at) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch {
    // Backend unreachable during build — ship the static routes at least.
  }

  return [...staticRoutes, ...productRoutes];
}
