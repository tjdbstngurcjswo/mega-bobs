import { ErrorBoundary, SiteFooter, SiteHeader } from '@/components/@shared';
import { MenuBoard } from '@/components/menu';
import { HeroDate, HeroStatus, HomeSide } from '@/components/home';
import getMenu from '@/api/getMenu';
import dayjs from '@/lib/dayjs';
import { formatYYYYMMDD, getWeekDays } from '@/utils/date';

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
          <p className="text-muted text-[11.5px] font-semibold tracking-[0.06em] uppercase">
            <HeroDate />
          </p>
          <h1 className="text-ink mt-3 text-[22px] font-extrabold tracking-[-0.02em] max-[560px]:text-[18px]">
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
