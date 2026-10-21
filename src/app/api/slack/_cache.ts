export const isMenuCacheHit = (cachedAt: number, startedAt: number) =>
  cachedAt < startedAt;
