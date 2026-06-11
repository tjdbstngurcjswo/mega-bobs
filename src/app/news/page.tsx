import type { Metadata } from 'next';

import getNews from '@/api/getNews';
import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import NewsCard from '@/components/news/NewsCard';
import { SITE_NAME } from '@/constants/site';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';

import {
  emptyNewsClass,
  emptyNewsDescClass,
  emptyNewsSoonClass,
  newsFootnoteClass,
} from './page.styles';

const newsDesc =
  '메가존 · 메가존클라우드 · 메가존소프트의 새 소식을 매일 아침 모아보기';

export const metadata: Metadata = {
  title: '메가존 소식',
  description: newsDesc,
  alternates: { canonical: '/news' },
  openGraph: {
    title: `메가존 소식 — ${SITE_NAME}`,
    description: newsDesc,
    url: '/news',
  },
};

export const revalidate = 21600;

export default async function NewsPage() {
  const news = await getNews();

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
        title="우리 회사 소식 모아보기"
        description="공식 채널의 새 소식을 매일 아침 모아드려요 — 원문으로 연결됩니다"
      >
        {news.length > 0 ? (
          <div className="flex flex-col gap-3">
            {news.map((item) => (
              <NewsCard key={item.url} news={item} />
            ))}
            <p className={newsFootnoteClass}>
              제목과 요약만 제공하며 본문은 출처(원문)에서 확인할 수 있어요
            </p>
          </div>
        ) : (
          <div className={emptyNewsClass}>
            <p className={emptyNewsSoonClass}>SOON</p>
            <p className={emptyNewsDescClass}>
              곧 메가존의 새 소식을 모아서 보여드릴게요
            </p>
          </div>
        )}
      </PageLayout>
      <SiteFooter />
    </>
  );
}
