import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.megabobs.com';
const isProd = process.env.VERCEL_ENV === 'production';

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
