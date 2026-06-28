import type { MetadataRoute } from 'next';

import { isProd, SITE_URL } from '@/utils/env';

export default function robots(): MetadataRoute.Robots {
  if (!isProd) {
    return {
      rules: [{ userAgent: '*', disallow: ['/'] }],
    };
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
