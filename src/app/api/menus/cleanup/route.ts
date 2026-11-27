import { NextRequest, NextResponse } from 'next/server';

import dayjs from '@/lib/dayjs';
import { supabaseServer } from '@/lib/supabaseServer';
import { formatYYYYMMDD, getMenuDateRange } from '@/utils/date';

const isAuthorized = (req: NextRequest): boolean => {
  const authHeader = req.headers.get('authorization');
  const secret = req.nextUrl.searchParams.get('secret');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManual = secret === process.env.REVALIDATE_SECRET;
  return isVercelCron || isManual;
};

/**
 * 저번주 월요일~다음주 일요일 밖 메뉴를 지운다.
 * 날짜는 `daily_menu` PK 앞부분이라 범위 삭제만 하고, 행 전체를 읽어오지 않는다.
 */
const deleteMenusOutsideWindow = async () => {
  const { minDate, maxDate } = getMenuDateRange(dayjs().tz());
  const menuStart = formatYYYYMMDD(minDate);
  const menuEnd = formatYYYYMMDD(maxDate);

  const [before, after] = await Promise.all([
    supabaseServer
      .from('daily_menu')
      .delete({ count: 'exact' })
      .lt('date', menuStart),
    supabaseServer
      .from('daily_menu')
      .delete({ count: 'exact' })
      .gt('date', menuEnd),
  ]);

  const error = before.error ?? after.error;
  const count = (before.count ?? 0) + (after.count ?? 0);

  return { error, count, menuStart, menuEnd };
};

/**
 * @route GET /api/menus/cleanup
 * @header authorization - `Bearer ${CRON_SECRET}` (Vercel Cron 자동 호출)
 * @query secret - REVALIDATE_SECRET (수동 호출 시)
 */
export const GET = async (req: NextRequest) => {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const menus = await deleteMenusOutsideWindow();
    if (menus.error) {
      return NextResponse.json({ error: menus.error.message }, { status: 500 });
    }

    return NextResponse.json({
      menusDeleted: menus.count,
      menuStart: menus.menuStart,
      menuEnd: menus.menuEnd,
    });
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
};
