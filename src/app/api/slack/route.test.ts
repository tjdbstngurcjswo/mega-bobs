import { createHmac } from 'crypto';

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>();
  return { ...actual, after: (fn: () => void) => fn() };
});

vi.mock('./_utils', () => ({
  getCachedMenu: vi.fn().mockResolvedValue([]),
  toDateInfo: vi.fn().mockReturnValue({ keyword: '오늘', date: '2026-07-09' }),
  toSlackFormat: vi.fn().mockReturnValue('formatted menu'),
}));

vi.mock('@/utils/gaServer', () => ({
  trackServerEvent: vi.fn(),
}));

import { POST } from './route';

const SECRET = 'test-signing-secret';

const sign = (timestamp: string, rawBody: string) =>
  `v0=${createHmac('sha256', SECRET)
    .update(`v0:${timestamp}:${rawBody}`)
    .digest('hex')}`;

const makeReq = (
  rawBody: string,
  timestamp: string,
  signature: string | null
) =>
  new Request('http://localhost/api/slack', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-slack-request-timestamp': timestamp,
      ...(signature ? { 'x-slack-signature': signature } : {}),
    },
    body: rawBody,
  }) as any;

describe('POST /api/slack', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 401 when signature header is missing', async () => {
    vi.stubEnv('SLACK_SIGNING_SECRET', SECRET);
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const res = await POST(makeReq('text=오늘', timestamp, null));

    expect(res.status).toBe(401);
  });

  it('returns 401 when signature is invalid', async () => {
    vi.stubEnv('SLACK_SIGNING_SECRET', SECRET);
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const res = await POST(makeReq('text=오늘', timestamp, 'v0=wrong'));

    expect(res.status).toBe(401);
  });

  it('returns 200 with in_channel response for a valid signature', async () => {
    vi.stubEnv('SLACK_SIGNING_SECRET', SECRET);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = 'text=오늘';

    const res = await POST(
      makeReq(rawBody, timestamp, sign(timestamp, rawBody))
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.response_type).toBe('in_channel');
  });
});
