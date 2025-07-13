import {Suspense} from 'react';

import HomeClient from '@/components/HomeClient';
import Loading from '@/components/Loading';
import getMenu from '@/lib/api/getMenu';
import {formatYYYYMMDD} from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const today = new Date();
  const menu = getMenu({date: formatYYYYMMDD(today), category: 'COURSE_1'});

  return (
    <Suspense fallback={<Loading />}>
      <HomeClient
        initialMenu={menu}
        initialDate={today}
        initialCategory="COURSE_1"
      />
    </Suspense>
  );
}
