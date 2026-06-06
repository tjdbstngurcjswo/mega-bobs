import {ErrorBoundary, SiteFooter, SiteHeader} from '@/components/@shared';
import MenuBoard from '@/components/board/MenuBoard';
import HeroDate from '@/components/home/HeroDate';
import HeroStatus from '@/components/home/HeroStatus';
import HomeSide from '@/components/home/HomeSide';
import getMenu from '@/lib/api/getMenu';
import dayjs from '@/lib/dayjs';
import {formatYYYYMMDD} from '@/lib/utils';

export const revalidate = 21600;

export default async function Home() {
  const today = dayjs().tz();
  const start = formatYYYYMMDD(today.subtract(1, 'week').startOf('week').add(1, 'day'));
  const end = formatYYYYMMDD(today.add(1, 'week').endOf('week').add(1, 'day'));

  const menus = await getMenu({start, end});

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(880px,calc(100%-40px))] flex-1">
        <section className="pt-12 pb-6">
          <p className="text-[11.5px] font-semibold tracking-[0.06em] text-muted uppercase">
            <HeroDate />
          </p>
          <h1 className="mt-3 text-[22px] font-extrabold tracking-[-0.02em] text-ink max-[560px]:text-[18px]">
            <HeroStatus menus={menus} />
          </h1>
        </section>
        <ErrorBoundary>
          <div className="grid grid-cols-[1fr_300px] items-stretch gap-6 pb-10 max-[920px]:grid-cols-1">
            <MenuBoard menus={menus} />
            <HomeSide />
          </div>
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </>
  );
}
