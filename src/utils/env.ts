export const isProd = process.env.VERCEL_ENV === 'production';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.megabobs.com';
