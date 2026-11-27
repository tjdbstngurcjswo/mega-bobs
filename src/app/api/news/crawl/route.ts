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

  // 기존 기사를 읽어 비교하지 않는다. title unique · url PK 에
  // INSERT ... ON CONFLICT DO NOTHING 으로 인덱스에서만 걸러진다.
  const { data: inserted, error } = await supabaseServer.rpc(
    'insert_company_news_if_new',
    { payload: rows }
  );

  if (error) {
    console.error('[news/crawl] insert 실패:', error.message);
    return NextResponse.json({ error: 'Upsert failed' }, { status: 500 });
  }

  const upserted = typeof inserted === 'number' ? inserted : 0;
  if (upserted > 0) revalidatePath('/news');

  return NextResponse.json({
    fetched: items.length,
    upserted,
    skipped: rows.length - upserted,
  });
};
