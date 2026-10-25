import { beforeEach, describe, expect, it, vi } from 'vitest';

const { forwardBatch } = vi.hoisted(() => ({ forwardBatch: vi.fn() }));

vi.mock('@/lib/beacon/collect', () => ({ forwardBatch }));

import { POST } from './route';

const batch = (siteId = 'mega-bobs') =>
  JSON.stringify({
    sentAt: '2026-10-25T00:00:00.000Z',
    events: [{ name: 'pageview', siteId, url: 'https://megabobs.com/' }],
  });

// SDK처럼 Content-Type 없이 문자열 본문을 보낸다
const makeReq = (body: string) =>
  new Request('http://localhost/api/collect', {
    method: 'POST',
    headers: { 'user-agent': 'Mozilla/5.0 (Macintosh)' },
    body,
  }) as any;

describe('POST /api/collect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    forwardBatch.mockResolvedValue(new Response(null, { status: 204 }));
  });

  it('forwards an own batch with the client user agent', async () => {
    const res = await POST(makeReq(batch()));

    expect(res.status).toBe(204);
    expect(forwardBatch).toHaveBeenCalledWith(
      batch(),
      'Mozilla/5.0 (Macintosh)'
    );
  });

  it('rejects batches for another site', async () => {
    const res = await POST(makeReq(batch('hongsoohyuk.com')));

    expect(res.status).toBe(400);
    expect(forwardBatch).not.toHaveBeenCalled();
  });

  it('rejects oversized bodies', async () => {
    const res = await POST(makeReq('x'.repeat(64 * 1024 + 1)));

    expect(res.status).toBe(413);
    expect(forwardBatch).not.toHaveBeenCalled();
  });

  it('passes the collector rejection status through', async () => {
    forwardBatch.mockResolvedValue(new Response(null, { status: 400 }));

    const res = await POST(makeReq(batch()));

    expect(res.status).toBe(400);
  });

  it('returns 502 so the SDK retries when the collector is unreachable', async () => {
    forwardBatch.mockRejectedValue(new Error('network'));

    const res = await POST(makeReq(batch()));

    expect(res.status).toBe(502);
  });
});
