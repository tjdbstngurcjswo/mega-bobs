const FALLBACK_SITE_URL = 'https://megabobs.vercel.app';

const RETIRED_HOSTS = new Set(['megabobs.com', 'www.megabobs.com']);

export const resolveSiteUrl = (raw?: string) => {
  if (!raw) return FALLBACK_SITE_URL;

  try {
    const url = new URL(raw);
    if (RETIRED_HOSTS.has(url.hostname)) return FALLBACK_SITE_URL;
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
};
