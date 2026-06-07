import type { Metadata } from 'next';

import { ErrorBoundary, PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { MenuBoard } from '@/components/menu';
import { HeroDate, HeroStatus } from '@/components/home';
import getMenu from '@/api/getMenu';
import { SITE_NAME } from '@/constants/site';
import dayjs from '@/lib/dayjs';
import { formatYYYYMMDD, getWeekDays } from '@/utils/date';

export const revalidate = 21600;

export const metadata: Metadata = {
  openGraph: { url: '/' },
  alternates: { canonical: '/' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description:
    '메가존 구내식당 메뉴, 실시간 운영 상태, 투표, 내기 게임까지 — 점심을 30초 안에 결정하세요.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  inLanguage: 'ko-KR',
};

export default async function Home() {
  const today = dayjs().tz();
  const start = formatYYYYMMDD(getWeekDays(today.subtract(1, 'week'))[0]);
  const end = formatYYYYMMDD(getWeekDays(today.add(1, 'week'))[6]);

  const menus = await getMenu({ start, end });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <PageLayout
        eyebrow={<HeroDate />}
        title={<HeroStatus menus={menus} />}
      >
        <ErrorBoundary>
          <MenuBoard menus={menus} />
        </ErrorBoundary>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
