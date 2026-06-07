import type { Metadata } from 'next';

import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { SITE_NAME } from '@/constants/site';
import dayjs from '@/lib/dayjs';
import { getAnnouncements } from '@/api/getAnnouncements';

import {
  articleBodyClass,
  articleClass,
  articleDateClass,
  articleTitleClass,
  articleYearClass,
  emptyNoticeClass,
  newBadgeClass,
} from './page.styles';

export const metadata: Metadata = {
  title: '공지사항',
  description: `${SITE_NAME}의 새 기능, 점검, 운영 안내를 확인하세요.`,
  openGraph: {
    title: `공지사항 — ${SITE_NAME}`,
    description: `${SITE_NAME}의 새 기능, 점검, 운영 안내를 확인하세요.`,
    url: '/notice',
  },
  twitter: {
    title: `공지사항 — ${SITE_NAME}`,
    description: `${SITE_NAME}의 새 기능, 점검, 운영 안내를 확인하세요.`,
  },
};

export default function NoticePage() {
  const notices = getAnnouncements();

  return (
    <>
      <SiteHeader />
      <PageLayout
        eyebrow="공지사항"
        title={`${SITE_NAME} 소식`}
        description="새 기능, 점검, 운영 안내를 여기서 알려드려요"
      >
        {notices.length > 0 ? (
          <div className="flex flex-col">
            {notices.map((n, i) => {
              const isNew =
                dayjs().tz().diff(dayjs.tz(n.publishedAt), 'day') < 7;
              return (
                <article key={n.id} className={articleClass(i === 0)}>
                  <div className="w-16 shrink-0">
                    <b className={articleDateClass}>
                      {dayjs.tz(n.publishedAt).format('M.D')}
                    </b>
                    <span className={articleYearClass}>
                      {dayjs.tz(n.publishedAt).format('YYYY')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className={articleTitleClass}>
                      {n.title}
                      {isNew && (
                        <span className={newBadgeClass}>NEW</span>
                      )}
                    </h3>
                    <p className={articleBodyClass}>{n.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={emptyNoticeClass}>아직 등록된 공지가 없어요</div>
        )}
      </PageLayout>
      <SiteFooter />
    </>
  );
}
