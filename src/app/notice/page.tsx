import type {Metadata} from 'next';

import noticeData from '@/../data/notices.json';
import {SiteFooter, SiteHeader} from '@/components/site';
import dayjs from '@/lib/dayjs';
import type {NoticeData} from '@/types/notice';

export const metadata: Metadata = {
  title: '공지사항 — MegaBobs',
  description: 'MegaBobs의 새 기능, 점검, 운영 안내',
};

export default function NoticePage() {
  const {notices, makers} = noticeData as NoticeData;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(880px,calc(100%-40px))] flex-1">
        <section className="pt-8 pb-5">
          <span className="inline-block bg-accent-soft px-2.5 py-1 text-xs font-extrabold tracking-wide text-accent-text">
            공지사항
          </span>
          <h1 className="mt-3 text-[27px] font-extrabold tracking-tight">MegaBobs 소식</h1>
          <p className="mt-2 text-[15px] text-muted">새 기능, 점검, 운영 안내를 여기서 알려드려요</p>
        </section>

        {notices.length > 0 ? (
          <div className="flex flex-col">
            {notices.map((n, i) => (
              <article
                key={n.id}
                className={`flex gap-5 border-b border-line px-1 py-5 ${i === 0 ? 'border-t-2 border-t-ink' : ''}`}
              >
                <div className="w-16 shrink-0">
                  <b className="block text-[17px] font-extrabold">
                    {dayjs.tz(n.publishedAt).format('M.D')}
                  </b>
                  <span className="block text-[11px] text-muted">
                    {dayjs.tz(n.publishedAt).format('YYYY')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="flex items-center gap-2 text-base font-extrabold">
                    {n.title}
                    {n.isNew && (
                      <span className="bg-accent px-1.5 py-0.5 text-[9.5px] font-extrabold text-ink">
                        NEW
                      </span>
                    )}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{n.body}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-t-2 border-t-ink px-1 py-12 text-center text-[13.5px] text-muted">
            아직 등록된 공지가 없어요
          </div>
        )}

        <section id="makers" className="mt-11 pb-16">
          <h2 className="border-b-2 border-ink pb-3 text-lg font-extrabold">만든 사람들</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
            {makers.map((m) => (
              <div key={m.name} className="shadow-flat border border-line bg-surface p-5">
                <h3 className="text-[15.5px] font-extrabold">{m.name}</h3>
                <p className="mt-0.5 text-xs text-muted">{m.role}</p>
                <a
                  href={`mailto:${m.email}`}
                  className="mt-2 inline-block border-b border-accent-soft pb-px text-xs font-bold text-accent-text"
                >
                  {m.email}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-xs leading-relaxed text-muted">
            점심시간을 아껴 만들고 있어요. 버그·아이디어·맛집 제보 모두 환영해요.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
