import type { Metadata } from 'next';

import { SiteFooter, SiteHeader } from '@/components/@shared';
import dayjs from '@/lib/dayjs';
import { getAnnouncements } from '@/api/getAnnouncements';

export const metadata: Metadata = {
  title: '공지사항 — MegaBobs',
  description: 'MegaBobs의 새 기능, 점검, 운영 안내',
};

export default function NoticePage() {
  const notices = getAnnouncements();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(880px,calc(100%-40px))] flex-1">
        <section className="pt-8 pb-5">
          <span className="bg-accent-soft text-accent-text inline-block px-2.5 py-1 text-xs font-extrabold tracking-wide">
            공지사항
          </span>
          <h1 className="mt-3 text-[27px] font-extrabold tracking-tight">
            MegaBobs 소식
          </h1>
          <p className="text-muted mt-2 text-[15px]">
            새 기능, 점검, 운영 안내를 여기서 알려드려요
          </p>
        </section>

        {notices.length > 0 ? (
          <div className="flex flex-col">
            {notices.map((n, i) => {
              const isNew =
                dayjs().tz().diff(dayjs.tz(n.publishedAt), 'day') < 7;
              return (
                <article
                  key={n.id}
                  className={`border-line flex gap-5 border-b px-1 py-5 ${i === 0 ? 'border-t-ink border-t-2' : ''}`}
                >
                  <div className="w-16 shrink-0">
                    <b className="block text-[17px] font-extrabold">
                      {dayjs.tz(n.publishedAt).format('M.D')}
                    </b>
                    <span className="text-muted block text-[11px]">
                      {dayjs.tz(n.publishedAt).format('YYYY')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="flex items-center gap-2 text-base font-extrabold">
                      {n.title}
                      {isNew && (
                        <span className="bg-accent text-ink px-1.5 py-0.5 text-[9.5px] font-extrabold">
                          NEW
                        </span>
                      )}
                    </h3>
                    <p className="text-ink-2 mt-1.5 text-[13.5px] leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border-t-ink text-muted border-t-2 px-1 py-12 text-center text-[13.5px]">
            아직 등록된 공지가 없어요
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
