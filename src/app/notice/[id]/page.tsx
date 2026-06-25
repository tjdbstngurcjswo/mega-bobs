import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getNoticeById, getNotices } from '@/api/getNotices';
import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import NoticeBody from '@/components/notice/NoticeBody';
import { SITE_NAME } from '@/constants/site';
import { formatRelativeDate } from '@/utils/date';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';

import { contentClass } from './page.styles';
import type { PageProps } from './page.types';

export const generateStaticParams = async () => {
  const notices = await getNotices();
  return notices.map((n) => ({ id: n.id }));
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) return { title: '공지사항' };
  return {
    title: notice.title,
    description: notice.body.slice(0, 120),
    alternates: { canonical: `/notice/${id}` },
    openGraph: {
      title: `${notice.title} — ${SITE_NAME}`,
      description: notice.body.slice(0, 120),
      url: `/notice/${id}`,
    },
  };
};

const NoticeDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', path: '/' },
              { name: '공지사항', path: '/notice' },
              { name: notice.title, path: `/notice/${id}` },
            ])
          ),
        }}
      />
      <SiteHeader />
      <PageLayout
        eyebrow="공지사항"
        title={notice.title}
        description={formatRelativeDate(
          notice.publishedAt,
          'YYYY년 MM월 DD일 HH:mm',
          true
        )}
      >
        <div className={contentClass}>
          <NoticeBody body={notice.body} />
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  );
};

export default NoticeDetailPage;
