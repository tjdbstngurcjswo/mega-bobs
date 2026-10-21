import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabaseServer', () => ({
  supabaseServer: { from: vi.fn() },
}));

vi.mock('@/api/getMenu', () => ({
  default: vi.fn(),
}));

import { toSlackFormat } from './_utils';

describe('toSlackFormat', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('links the vote footer to the vercel app', () => {
    const text = toSlackFormat([], '오늘', '2026-10-21');

    expect(text).toContain(
      '<https://megabobs.vercel.app|🔗 투표하고 인기 메뉴 확인하기>'
    );
    expect(text).not.toContain('megabobs.com');
  });
});
