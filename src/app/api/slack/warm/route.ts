import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { WARM_KEYWORDS } from '@/constants/slack';

/**
 * @route GET /api/slack/warm
 * @description Vercel Cron이 매일 15:00 UTC 호출. 홈 경로를 재검증하고 슬랙 메뉴 캐시를 채운다.
 * `menu` 태그는 여기서 만료하지 않는다. 만료는 응답이 끝난 뒤에 적용되어 방금 채운 캐시까지 지운다.
 * 식단 갱신 시 캐시 만료는 /api/revalidate 가 담당한다.
 * @returns `{ results }` — 키워드별 워밍 결과와 캐시 hit/miss
 */
export const GET = async (req: NextRequest) => {
  revalidatePath('/');

  const origin = req.nextUrl.origin;
  const results = await Promise.all(
    WARM_KEYWORDS.map(async (keyword) => {
      const body = new URLSearchParams();
      if (keyword) body.set('text', keyword);

      const res = await fetch(`${origin}/api/slack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        cache: 'no-store',
      });

      const errorBody = res.ok
        ? undefined
        : await res.text().catch(() => undefined);

      return {
        keyword: keyword ?? '(default)',
        status: res.status,
        ok: res.ok,
        cache: res.headers.get('x-menu-cache'),
        body: errorBody,
      };
    })
  );

  const hasError = results.some((r) => !r.ok);
  return NextResponse.json({ results }, { status: hasError ? 500 : 200 });
};
