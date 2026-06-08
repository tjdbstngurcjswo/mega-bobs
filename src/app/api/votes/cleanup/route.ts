import { NextRequest } from 'next/server';

import { err, ok } from '@/lib/apiResponse';
import dayjs from '@/lib/dayjs';
import { supabaseServer } from '@/lib/supabaseServer';

export const GET = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  const secret = req.nextUrl.searchParams.get('secret');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManual = secret === process.env.REVALIDATE_SECRET;

  if (!isVercelCron && !isManual) return err('unauthorized', 401);

  const cutoff = dayjs().tz().subtract(14, 'day').format('YYYY-MM-DD');

  try {
    const { error, count } = await supabaseServer
      .from('menu_votes')
      .delete({ count: 'exact' })
      .lt('date', cutoff);

    if (error) return err(error.message, 500);

    return ok({ deleted: count, cutoff });
  } catch (error: unknown) {
    return err(error instanceof Error ? error.message : 'server error', 500);
  }
};
