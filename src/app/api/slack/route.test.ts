import { beforeEach, describe, expect, it, vi } from 'vitest';

const reportSlackCommand = vi.fn();

vi.mock('next/server', async () => {
  const actual =
    await vi.importActual<typeof import('next/server')>('next/server');
  return {
    ...actual,
    after: (task: () => unknown) => {
      void task();
    },
  };
});

vi.mock('./_utils', () => ({
  getCachedMenu: vi.fn(),
  toDateInfo: (text: string | null) => {
    if (text === '나중에') return null;
    return { keyword: text?.trim() || '오늘', date: '2026-10-21' };
  },
  toSlackFormat: () => 'formatted menu',
}));

vi.mock('./_report', () => ({
  reportSlackCommand: (...args: unknown[]) => reportSlackCommand(...args),
}));

import { getCachedMenu } from './_utils';
import { POST } from './route';

const cachedMenu = vi.mocked(getCachedMenu);

const makeReq = (fields: Record<string, string>) => {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return new Request('http://localhost/api/slack', {
    method: 'POST',
    body: form,
  }) as never;
};

describe('POST /api/slack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, 'now').mockReturnValue(5_000);
    cachedMenu.mockResolvedValue({
      menus: [],
      cachedAt: 1_000,
    });
  });

  it('marks a cache hit and records a real slash command', async () => {
    const res = await POST(makeReq({ text: '오늘', user_id: 'U123' }));

    expect(res.headers.get('x-menu-cache')).toBe('hit');
    expect(res.headers.get('x-menu-cached-at')).toBe('1000');
    expect(reportSlackCommand).toHaveBeenCalledWith({
      track: true,
      keyword: '오늘',
      date: '2026-10-21',
      cacheHit: true,
      cachedAt: 1_000,
      durationMs: 0,
    });
  });

  it('does not record cache warming calls that have no slack user', async () => {
    cachedMenu.mockResolvedValue({ menus: [], cachedAt: 5_000 });

    const res = await POST(makeReq({ text: '오늘' }));

    expect(res.headers.get('x-menu-cache')).toBe('miss');
    expect(reportSlackCommand).toHaveBeenCalledWith(
      expect.objectContaining({ track: false, cacheHit: false })
    );
  });
});
