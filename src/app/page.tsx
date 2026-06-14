import type { Metadata } from 'next';
import { headers } from 'next/headers';

import getMenu from '@/api/getMenu';
import {
  ErrorBoundary,
  PageLayout,
  SiteFooter,
  SiteHeader,
} from '@/components/@shared';
import { HeroStatus } from '@/components/home';
import { MenuBoard } from '@/components/menu';
import dayjs from '@/lib/dayjs';
import { formatYYYYMMDD, getWeekDays } from '@/utils/date';
import {
  getCafeteriaJsonLd,
  getOrgJsonLd,
  getWebsiteJsonLd,
} from '@/utils/jsonLd';

export const metadata: Metadata = {
  openGraph: { url: '/' },
  alternates: { canonical: '/' },
};

export default async function Home() {
  const today = dayjs().tz();
  const start = formatYYYYMMDD(getWeekDays(today.subtract(1, 'week'))[0]);
  const end = formatYYYYMMDD(getWeekDays(today.add(1, 'week'))[6]);

  const menus = await getMenu({ start, end });

  const hdrs = await headers();
  const country = hdrs.get('x-vercel-ip-country');
  const isKorea = !country || country === 'KR';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrgJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getCafeteriaJsonLd()),
        }}
      />
      <SiteHeader />
      <PageLayout
        eyebrow="식단표"
        title={<HeroStatus menus={menus} />}
        description="매주 목요일 업데이트되는 구내식당 코스별 식단표에요"
      >
        <ErrorBoundary>
          <MenuBoard menus={menus} isKorea={isKorea} />
        </ErrorBoundary>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
