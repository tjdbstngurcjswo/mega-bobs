import {NextResponse} from 'next/server';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

const WARM_KEYWORDS: (string | null)[] = [null, '오늘', '내일', '모레', '글피'];

export async function GET() {
  const baseUrl = getBaseUrl();

  const results = await Promise.all(
    WARM_KEYWORDS.map(async (keyword) => {
      const params = new URLSearchParams();
      if (keyword) params.set('text', keyword);

      const url = `${baseUrl}/api/slack${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, {next: {revalidate: 0}});
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
