import { describe, expect, it, vi } from 'vitest';

import { POST } from './route';

vi.mock('@/lib/supabaseServer', () => ({
  supabaseServer: {
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

vi.mock('@/lib/geoHeaders', () => ({
  extractGeo: () => ({
    ip: '1.2.3.4',
    country: 'KR',
    region: null,
    city: null,
  }),
  isKoreaGeo: () => true,
}));

const makeReq = (body: object, voterId = 'voter-123') =>
  new Request('http://localhost/api/renewal-feedback', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-voter-id': voterId },
    body: JSON.stringify(body),
  }) as any;

describe('POST /api/renewal-feedback', () => {
  it('returns 400 when voter-id missing', async () => {
    const req = new Request('http://localhost/api/renewal-feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ version: 'v1', score: 4 }),
    }) as any;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid score', async () => {
    const res = await POST(makeReq({ version: 'v1', score: 6 }));
    expect(res.status).toBe(400);
  });

  it('returns ok:true for valid payload with page', async () => {
    const res = await POST(makeReq({ version: 'v1', score: 4, page: '/news' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it('returns ok:true for valid payload without page', async () => {
    const res = await POST(makeReq({ version: 'v1', score: 3 }));
    expect(res.status).toBe(200);
  });
});
