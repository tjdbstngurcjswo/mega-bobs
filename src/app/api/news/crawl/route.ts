import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { fetchNews } from '@/lib/news/fetchNews';
import { supabaseServer } from '@/lib/supabaseServer';

export const maxDuration = 60;

// GitHub Actions(news-crawl.yml)가 Authorization: Bearer 헤더로 호출한다.
// 수동 실행은 workflow_dispatch 또는 동일 Bearer 헤더 curl 사용.
const isAuthorized = (req: NextRequest): boolean => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get('authorization') === `Bearer ${secret}`;
};

export const GET = async (req: NextRequest) => {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await fetchNews();

  if (items.length === 0) {
    return NextResponse.json({ fetched: 0, upserted: 0 });
  }

  const rows = items.map((item) => ({
    url: item.url,
    title: item.title,
    summary: item.summary,
    source: item.source,
    company: item.company,
    published_at: item.publishedAt,
  }));

  const { error } = await supabaseServer
    .from('company_news')
    .upsert(rows, { onConflict: 'url' });

  if (error) {
    console.error('[news/crawl] upsert 실패:', error.message);
    return NextResponse.json({ error: 'Upsert failed' }, { status: 500 });
  }

  revalidatePath('/news');

  return NextResponse.json({ fetched: items.length, upserted: rows.length });
};
