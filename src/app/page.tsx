import {Suspense} from 'react';

import HomeClient from '@/components/HomeClient';
import Loading from '@/components/Loading';
import getMenu from '@/lib/api/getMenu';
import {formatYYYYMMDD} from '@/lib/utils';

export default async function Home() {
  // SSR: 오늘 날짜와 lunch로 메뉴 fetch
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
