import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import {Suspense} from 'react';

import HomeClient from '@/components/HomeClient';
import Loading from '@/components/Loading';
import getWeeklyMenu from '@/lib/api/getWeeklyMenu';
import {formatYYYYMMDD, getWeekRange} from '@/lib/utils';

export default async function Home() {
  const today = new Date();
  const week = getWeekRange(today);
  const queryClient = new QueryClient();
  const start = formatYYYYMMDD(week[0]);
  const end = formatYYYYMMDD(week[6]);

  await queryClient.prefetchQuery({
    queryKey: ['LIST_WEEKLY_MENU', start, end],
    queryFn: async () => await getWeeklyMenu({start, end}),
  });

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeClient initialDate={today} initialWeek={week} />
      </HydrationBoundary>
    </Suspense>
  );
}
