import { Bell } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { getNotices } from '@/api/getNotices';
import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { SITE_NAME } from '@/constants/site';
import dayjs from '@/lib/dayjs';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';
import { stripMarkdown } from '@/utils/stripMarkdown';

import {
  articleBodyClass,
  articleClass,
  articleDateClass,
  articleTitleClass,
  articleYearClass,
  emptyNoticeClass,
} from './page.styles';

const noticeDesc = `${SITE_NAME} 구내식당 앱의 새 기능 소식, 점검 일정, 운영 안내를 확인하세요.`;

export const metadata: Metadata = {
  title: '공지사항',
  description: noticeDesc,
  alternates: { canonical: '/notice' },
  openGraph: {
    title: `${SITE_NAME} ∙ 공지사항`,
    description: noticeDesc,
    url: '/notice',
  },
  twitter: {
    title: `${SITE_NAME} ∙ 공지사항`,
    description: noticeDesc,
  },
};

export default function NoticePage() {
  const notices = getNotices();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', path: '/' },
              { name: '공지사항', path: '/notice' },
            ])
          ),
        }}
      />
      <SiteHeader />
      <PageLayout
        eyebrow="공지사항"
        title={
          <span className="inline-flex items-center gap-2.5">
            <Bell size={26} strokeWidth={2} />
            <span>{`${SITE_NAME} 소식`}</span>
          </span>
        }
        description="새 기능, 점검, 운영 안내를 여기서 알려드려요"
      >
        {notices.length > 0 ? (
          <div className="flex flex-col">
            {notices.map((n, i) => (
              <Link
                key={n.id}
                href={`/notice/${n.id}`}
                className={articleClass(i === 0)}
              >
                <div className="w-14 shrink-0 text-right">
                  <span className={articleYearClass}>
                    {dayjs.tz(n.publishedAt).format('YYYY')}
                  </span>
                  <b className={articleDateClass}>
                    {dayjs.tz(n.publishedAt).format('MM.DD')}
                  </b>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={articleTitleClass}>
                    <span className="truncate">{n.title}</span>
                  </h3>
                  <p className={articleBodyClass}>{stripMarkdown(n.body)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={emptyNoticeClass}>아직 등록된 공지가 없어요</div>
        )}
      </PageLayout>
      <SiteFooter />
    </>
  );
}
