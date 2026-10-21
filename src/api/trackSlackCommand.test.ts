import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const { insert } = vi.hoisted(() => ({
  insert: vi.fn(),
}));

vi.mock('@/lib/supabaseServer', () => ({
  supabaseServer: {
    from: () => ({ insert }),
  },
}));

import trackSlackCommand from './trackSlackCommand';

describe('trackSlackCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    insert.mockResolvedValue({ error: null });
  });

  it('stores the command without a slack user id', async () => {
    await trackSlackCommand({
      keyword: '오늘',
      date: '2026-10-21',
      cacheHit: true,
      cachedAt: 1_700_000_000_000,
      durationMs: 12,
    });

    expect(insert).toHaveBeenCalledWith({
      keyword: '오늘',
      menu_date: '2026-10-21',
      cache_hit: true,
      cached_at: new Date(1_700_000_000_000).toISOString(),
      duration_ms: 12,
    });
  });
});
