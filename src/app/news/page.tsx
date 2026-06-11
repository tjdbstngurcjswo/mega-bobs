import type { Metadata } from 'next';

import { getNews } from '@/api/news';
import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { NewsList } from '@/components/news';
import { SITE_NAME } from '@/constants/site';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';

export const revalidate = 3600;

const newsDesc = `${SITE_NAME} 메가존 관련 최신 언론 기사 모음`;

export const metadata: Metadata = {
  title: '소식',
  description: newsDesc,
  alternates: { canonical: '/news' },
  openGraph: {
    title: `소식 — ${SITE_NAME}`,
    description: newsDesc,
    url: '/news',
  },
};

export default async function NewsPage() {
  const items = await getNews();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', path: '/' },
              { name: '소식', path: '/news' },
            ])
          ),
        }}
      />
      <SiteHeader />
      <PageLayout
        eyebrow="메가존 소식"
        title="메가존 뉴스"
        description="메가존 관련 최신 언론 기사를 모아봤어요"
      >
        <NewsList items={items} />
      </PageLayout>
      <SiteFooter />
    </>
  );
}
