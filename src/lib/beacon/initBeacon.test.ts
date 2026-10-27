import { afterEach, describe, expect, it, vi } from 'vitest';

const { init } = vi.hoisted(() => ({ init: vi.fn() }));

vi.mock('hongsoohyuk-beacon', () => ({ init }));

import initBeacon from './initBeacon';

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

const stubBrowser = (hostname: string, userAgent = BROWSER_UA) => {
  vi.stubGlobal('window', {});
  vi.stubGlobal('navigator', { userAgent });
  vi.stubGlobal('location', { hostname });
};

describe('initBeacon', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('initializes the SDK against the collector on the production host', () => {
    stubBrowser('megabobs.vercel.app');

    initBeacon();

    expect(init).toHaveBeenCalledWith({
      endpoint: 'https://www.hongsoohyuk.com/api/collect',
      siteId: 'mega-bobs',
    });
  });

  it('skips bots', () => {
    stubBrowser(
      'megabobs.vercel.app',
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    );

    initBeacon();

    expect(init).not.toHaveBeenCalled();
  });

  it('skips hosts outside the collector CORS allowlist', () => {
    stubBrowser('megabobs-git-dev.vercel.app');

    initBeacon();

    expect(init).not.toHaveBeenCalled();
  });

  it('does nothing on the server', () => {
    initBeacon();

    expect(init).not.toHaveBeenCalled();
  });
});
