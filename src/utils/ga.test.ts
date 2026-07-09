import { afterEach, describe, expect, it, vi } from 'vitest';

const sendGAEventMock = vi.fn();
vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: (...args: unknown[]) => sendGAEventMock(...args),
}));

import { trackEvent } from './ga';

describe('trackEvent', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('does nothing outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');

    trackEvent('event', 'test_event');

    expect(sendGAEventMock).not.toHaveBeenCalled();
  });

  it('skips sending when navigator UA is a bot', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    });

    trackEvent('event', 'test_event');

    expect(sendGAEventMock).not.toHaveBeenCalled();
  });

  it('sends the event for a normal browser UA in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    });

    trackEvent('event', 'test_event', { foo: 'bar' });

    expect(sendGAEventMock).toHaveBeenCalledWith('event', 'test_event', {
      foo: 'bar',
    });
  });
});
