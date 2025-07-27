import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {Suspense} from 'react';

import HomeClient from '@/components/HomeClient';
import Loading from '@/components/Loading';
import getWeeklyMenu from '@/lib/api/getWeeklyMenu';
import {formatYYYYMMDD, getWeekDays} from '@/lib/utils';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

export default async function Home() {
  const today = dayjs().toDate();
  const week = getWeekDays(today);
  const queryClient = new QueryClient();
  const start = formatYYYYMMDD(week[0]);
  const end = formatYYYYMMDD(week[6]);

  await queryClient.prefetchQuery({
    queryKey: ['LIST_WEEKLY_MENU', start, end],
    queryFn: async () => await getWeeklyMenu({start, end}),
  });

  console.info('On Server', formatYYYYMMDD(today));

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeClient initialDate={formatYYYYMMDD(today)} />
      </HydrationBoundary>
    </Suspense>
  );
}
