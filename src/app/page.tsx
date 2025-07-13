import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import {Suspense} from 'react';

import HomeClient from '@/components/HomeClient';
import Loading from '@/components/Loading';
import getMenu from '@/lib/api/getMenu';
import {formatYYYYMMDD} from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const today = new Date();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['GET_MENU', today, 'COURSE_1'],
    queryFn: async () =>
      await getMenu({date: formatYYYYMMDD(today), category: 'COURSE_1'}),
  });

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeClient initialDate={today} initialCategory="COURSE_1" />
      </HydrationBoundary>
    </Suspense>
  );
}
