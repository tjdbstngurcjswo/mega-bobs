import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const revalidatePath = vi.fn();
const revalidateTag = vi.fn();

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
}));

import { GET } from './route';

describe('GET /api/slack/warm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'x-menu-cache': 'miss' }),
        text: async () => '',
      })
    );
  });

  it('fills the slack cache without expiring the menu tag in the same request', async () => {
    const req = new NextRequest('http://localhost/api/slack/warm');
    const res = await GET(req);
    const body = await res.json();

    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalled();
    expect(body.results[0].cache).toBe('miss');
    expect(res.status).toBe(200);
  });
});
