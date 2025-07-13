import {Suspense} from 'react';

import {HomeClient} from '@/components/HomeClient';
import {Loading} from '@/components/Loading';
import getMenu from '@/lib/api/getMenu';
import {formatYYYYMMDD} from '@/lib/utils';

export default async function Home() {
  // SSR: 오늘 날짜와 lunch로 메뉴 fetch
  const today = new Date('2025-07-14');
  const menu = getMenu(formatYYYYMMDD(today));

  return (
    <Suspense fallback={<Loading />}>
      <HomeClient initialMenu={menu} initialDate={today} />
    </Suspense>
  );
}
