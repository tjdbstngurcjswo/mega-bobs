import { beforeEach, describe, expect, it, vi } from 'vitest';

const trackServerEvent = vi.fn();

vi.mock('@/utils/gaServer', () => ({
  trackServerEvent: (...args: unknown[]) => trackServerEvent(...args),
}));

vi.mock('@/lib/supabaseServer', () => ({
  supabaseServer: {
    from: () => {
      throw new Error('slack usage must not write to the database');
    },
  },
}));

import { reportSlackCommand } from './_report';

describe('reportSlackCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends cache hit usage to analytics without a database write', async () => {
    await reportSlackCommand({
      track: true,
      keyword: '오늘',
      date: '2026-10-21',
      cacheHit: true,
      durationMs: 12,
    });

    expect(trackServerEvent).toHaveBeenCalledWith('slack_bot_call', {
      keyword: '오늘',
      date: '2026-10-21',
      cache_hit: 'hit',
      duration_ms: 12,
    });
  });

  it('skips warming calls', async () => {
    await reportSlackCommand({
      track: false,
      keyword: '오늘',
      date: '2026-10-21',
      cacheHit: false,
      durationMs: 4,
    });

    expect(trackServerEvent).not.toHaveBeenCalled();
  });
});
