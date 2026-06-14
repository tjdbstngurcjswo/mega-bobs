import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { WARM_KEYWORDS } from '@/constants/slack';

/**
 * @route GET /api/slack/warm
 * @description Vercel Cron이 매일 15:00 UTC 호출 — '/' 경로와 'menu' 태그 재검증 후 Slack 응답 캐시 워밍
 * @returns `{ results }` — 키워드별 워밍 결과 목록
 */
export async function GET(req: NextRequest) {
  revalidatePath('/');
  revalidateTag('menu');

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
        body: errorBody,
      };
    })
  );

  const hasError = results.some((r) => !r.ok);
  return NextResponse.json({ results }, { status: hasError ? 500 : 200 });
}
