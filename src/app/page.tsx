import MenuBoard from '@/components/board/MenuBoard';
import ErrorBoundary from '@/components/ErrorBoundary';
import HeroDate from '@/components/home/HeroDate';
import HomeSide from '@/components/home/HomeSide';
import {SiteFooter, SiteHeader} from '@/components/site';
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
      <main className="mx-auto w-[min(880px,calc(100%-40px))]">
        <section className="pt-8 pb-5">
          <span className="inline-block bg-accent-soft px-2.5 py-1 text-xs font-extrabold tracking-wide text-accent-text">
            <HeroDate /> · 과천 지식정보타운
          </span>
          <h1 className="mt-3 text-[27px] font-extrabold tracking-tight max-[560px]:text-[22px]">
            오늘{' '}
            <mark className="px-1 text-ink [background:linear-gradient(transparent_58%,var(--color-highlight)_58%)]">
              점심
            </mark>
            , 정하셨나요?
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
