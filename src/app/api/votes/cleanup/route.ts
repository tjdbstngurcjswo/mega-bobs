import { NextRequest, NextResponse } from 'next/server';

import dayjs from '@/lib/dayjs';
import { supabaseServer } from '@/lib/supabaseServer';

/**
 * @route GET /api/votes/cleanup
 * @header authorization - `Bearer ${CRON_SECRET}` (Vercel Cron 자동 호출)
 * @query secret - REVALIDATE_SECRET (수동 호출 시)
 * @returns `{ deleted, cutoff }` — 삭제된 행 수와 기준 날짜 (오늘 -14일)
 */
export const GET = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  const secret = req.nextUrl.searchParams.get('secret');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManual = secret === process.env.REVALIDATE_SECRET;

  if (!isVercelCron && !isManual) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const cutoff = dayjs().tz().subtract(14, 'day').format('YYYY-MM-DD');

  try {
    const { error, count } = await supabaseServer
      .from('menu_votes')
      .delete({ count: 'exact' })
      .lt('date', cutoff);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: count, cutoff });
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
};
