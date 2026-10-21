import { resolveSiteUrl } from '@/utils/siteUrl';

export const isProd = process.env.VERCEL_ENV === 'production';

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
