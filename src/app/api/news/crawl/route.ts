import {revalidatePath} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';

import {fetchNews} from '@/lib/news/fetchNews';
import {supabaseServer} from '@/lib/supabase-server';

const isAuthorized = (req: NextRequest): boolean => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  // Vercel Cron 은 Authorization: Bearer 헤더로 호출, 수동 호출은 ?secret= 허용
  const bearer = req.headers.get('authorization') === `Bearer ${secret}`;
  const query = req.nextUrl.searchParams.get('secret') === secret;
  return bearer || query;
};

export const GET = async (req: NextRequest) => {
  if (!isAuthorized(req)) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  const items = await fetchNews();

  if (items.length === 0) {
    return NextResponse.json({inserted: 0, fetched: 0});
  }

  const rows = items.map((item) => ({
    url: item.url,
    title: item.title,
    summary: item.summary,
    source: item.source,
    company: item.company,
    published_at: item.publishedAt,
  }));

  const {error} = await supabaseServer
    .from('company_news')
    .upsert(rows, {onConflict: 'url'});

  if (error) return NextResponse.json({error: error.message}, {status: 500});

  revalidatePath('/news');

  return NextResponse.json({fetched: items.length, upserted: rows.length});
};
