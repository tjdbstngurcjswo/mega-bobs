import type {Metadata} from 'next';

import {SiteFooter, SiteHeader} from '@/components/@shared';
import NewsCard from '@/components/news/NewsCard';
import getNews from '@/lib/api/getNews';

export const metadata: Metadata = {
  title: '메가존 소식 — MegaBobs',
  description:
    '메가존 · 메가존클라우드 · 메가존소프트의 새 소식을 매일 아침 모아보기',
};

export const revalidate = 21600;

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(880px,calc(100%-40px))] flex-1">
        <section className="pt-8 pb-5">
          <span className="bg-accent-soft text-accent-text inline-block px-2.5 py-1 text-xs font-extrabold tracking-wide">
            메가존 소식
          </span>
          <h1 className="mt-3 text-[27px] font-extrabold tracking-tight">
            우리 회사 소식 모아보기
          </h1>
          <p className="text-muted mt-2 text-[15px]">
            공식 채널의 새 소식을 매일 아침 모아드려요 — 원문으로 연결됩니다
          </p>
        </section>

        {news.length > 0 ? (
          <div className="flex flex-col gap-3">
            {news.map((item) => (
              <NewsCard key={item.url} news={item} />
            ))}
            <p className="text-muted pt-1.5 text-center text-xs">
              제목과 요약만 제공하며 본문은 출처(원문)에서 확인할 수 있어요
            </p>
          </div>
        ) : (
          <div className="border-t-ink border-t-2 px-1 py-16 text-center">
            <p className="text-muted text-2xl font-extrabold tracking-[0.2em]">
              SOON
            </p>
            <p className="text-muted mt-3 text-[13.5px]">
              곧 메가존의 새 소식을 모아서 보여드릴게요
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
