import { ErrorBoundary, SiteFooter, SiteHeader } from '@/components/@shared';
import { MenuBoard } from '@/components/menu';
import { HeroDate, HeroStatus } from '@/components/home';
import getMenu from '@/api/getMenu';
import dayjs from '@/lib/dayjs';
import { formatYYYYMMDD, getWeekDays } from '@/utils/date';

import { heroDatelabelClass, heroTitleClass } from './page.styles';

export const revalidate = 21600;

export default async function Home() {
  const today = dayjs().tz();
  const start = formatYYYYMMDD(getWeekDays(today.subtract(1, 'week'))[0]);
  const end = formatYYYYMMDD(getWeekDays(today.add(1, 'week'))[6]);

  const menus = await getMenu({ start, end });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(880px,calc(100%-40px))] flex-1">
        <section className="pt-12 pb-6">
          <p className={heroDatelabelClass}>
            <HeroDate />
          </p>
          <h1 className={heroTitleClass}>
            <HeroStatus menus={menus} />
          </h1>
        </section>
        <ErrorBoundary>
          <div className="pb-10">
            <MenuBoard menus={menus} />
          </div>
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </>
  );
}
