import type { Metadata } from 'next';

import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { LadderGame } from '@/components/ladder';
import { SITE_NAME } from '@/constants/site';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';

const desc =
  '참여자와 항목을 입력하고 사다리를 돌려보세요. 결과는 언제나 공평해요.';

export const metadata: Metadata = {
  title: '사다리게임',
  description: desc,
  alternates: { canonical: '/games/ladder' },
  openGraph: {
    title: `사다리게임 — ${SITE_NAME}`,
    description: desc,
    url: '/games/ladder',
  },
};

export default function LadderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', path: '/' },
              { name: '미니게임', path: '/games' },
              { name: '사다리게임', path: '/games/ladder' },
            ])
          ),
        }}
      />
      <SiteHeader />
      <PageLayout
        eyebrow="미니게임"
        title="사다리게임"
        description="참여자와 항목을 채우고 사다리를 돌려보세요"
      >
        <LadderGame />
      </PageLayout>
      <SiteFooter />
    </>
  );
}
