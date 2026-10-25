import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const env = vi.hoisted(() => ({ isProd: true }));

vi.mock('@/utils/env', () => ({
  get isProd() {
    return env.isProd;
  },
  SITE_URL: 'https://megabobs.com',
}));

import { trackServerEvent } from './collect';

describe('trackServerEvent', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    env.isProd = true;
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('posts a mega-bobs batch to the collector', async () => {
    await trackServerEvent('slack_bot_call', { cache_hit: true }, '/api/slack');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://hongsoohyuk.com/api/collect');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).events).toEqual([
      expect.objectContaining({
        name: 'slack_bot_call',
        siteId: 'mega-bobs',
        url: 'https://megabobs.com/api/slack',
        props: { cache_hit: true },
      }),
    ]);
  });

  it('does nothing outside production', async () => {
    env.isProd = false;

    await trackServerEvent('slack_bot_call');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('swallows collector failures', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValue(new Error('network'));

    await expect(trackServerEvent('slack_bot_call')).resolves.toBeUndefined();
  });
});
