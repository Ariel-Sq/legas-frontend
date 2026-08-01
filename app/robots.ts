import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/environments';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private / transactional pages — no SEO value, some leak state.
      disallow: [
        '/api/',
        '/cart',
        '/checkout',
        '/orders',
        '/order-confirmation',
        '/profile',
        '/settings',
        '/wishlist',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
