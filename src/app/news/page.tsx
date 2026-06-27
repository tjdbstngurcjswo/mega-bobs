import { Newspaper } from 'lucide-react';
import type { Metadata } from 'next';


import getNews, { getLastCrawledAt } from '@/api/getNews';
import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import NewsFilter from '@/components/news/NewsFilter';
import { SITE_NAME } from '@/constants/site';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';

import {
  emptyNewsClass,
  emptyNewsDescClass,
  emptyNewsIconClass,
  emptyNewsTitleClass,
} from './page.styles';

const newsDesc =
  '메가존 · 메가존클라우드 · 메가존소프트의 새 소식을 매일 아침 모아보기';

export const metadata: Metadata = {
  title: '메가존 소식',
  description: newsDesc,
  alternates: { canonical: '/news' },
  openGraph: {
    title: `${SITE_NAME} ∙ 메가존 소식`,
    description: newsDesc,
    url: '/news',
  },
  twitter: {
    title: `${SITE_NAME} ∙ 메가존 소식`,
    description: newsDesc,
  },
};

export const revalidate = 21600;

export default async function NewsPage() {
  const [all, megazone, megazonecloud, megazonesoft, lastCrawledAt] =
    await Promise.all([
      getNews(),
      getNews({ company: 'megazone' }),
      getNews({ company: 'megazonecloud' }),
      getNews({ company: 'megazonesoft' }),
      getLastCrawledAt(),
    ]);

  const newsByFilter = { all, megazone, megazonecloud, megazonesoft };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', path: '/' },
              { name: '메가존 소식', path: '/news' },
            ])
          ),
        }}
      />
      <SiteHeader />
      <PageLayout
        eyebrow="메가존 소식"
        title={
          <span className="inline-flex items-center gap-2.5">
            <Newspaper size={26} strokeWidth={2} />
            <span>우리 회사 소식 모아보기</span>
          </span>
        }
        description="구글 뉴스에서 찾아온 우리 회사 소식이에요"
      >
        {all.length > 0 ? (
          <NewsFilter
            newsByFilter={newsByFilter}
            lastCrawledAt={lastCrawledAt}
          />
        ) : (
          <div className={emptyNewsClass}>
            <Newspaper className={emptyNewsIconClass} strokeWidth={1.5} />
            <p className={emptyNewsTitleClass}>소식을 준비 중이에요</p>
            <p className={emptyNewsDescClass}>조금만 기다려주세요</p>
          </div>
        )}
      </PageLayout>
      <SiteFooter />
    </>
  );
}
