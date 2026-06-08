// In-memory store — per-instance on Vercel serverless (not shared across instances).
// Good enough for abuse deterrence; not a hard enforcement boundary.
const store = new Map<string, { count: number; reset: number }>();

export const rateLimit = (
  key: string,
  limit: number,
  windowMs: number
): boolean => {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
};
