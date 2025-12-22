import {NextRequest, NextResponse} from 'next/server';

const WARM_KEYWORDS: (string | null)[] = [null, '오늘', '내일', '모레', '글피'];

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const results = await Promise.all(
    WARM_KEYWORDS.map(async (keyword) => {
      const params = new URLSearchParams();
      if (keyword) params.set('text', keyword);

      const url = `${origin}/api/slack${params.toString() ? `?${params}` : ''}`;
      const res = await fetch(url, {cache: 'no-store'});

      const body = res.ok ? undefined : await res.text().catch(() => undefined);

      return {
        keyword: keyword ?? '(default)',
        status: res.status,
        ok: res.ok,
        body,
      };
    })
  );

  const hasError = results.some((r) => !r.ok);
  return NextResponse.json({results}, {status: hasError ? 500 : 200});
}
