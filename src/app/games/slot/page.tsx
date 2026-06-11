import type { Metadata } from 'next';

import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { SlotMachine } from '@/components/games';
import { SITE_NAME } from '@/constants/site';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';

const slotDesc = '이름을 넣고 돌리면 딱 한 명이 뽑혀요';

export const metadata: Metadata = {
  title: '슬롯머신',
  description: slotDesc,
  alternates: { canonical: '/games/slot' },
  openGraph: {
    title: `슬롯머신 — ${SITE_NAME}`,
    description: slotDesc,
    url: '/games/slot',
  },
};

export default function SlotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', path: '/' },
              { name: '미니게임', path: '/games' },
              { name: '슬롯머신', path: '/games/slot' },
            ])
          ),
        }}
      />
      <SiteHeader />
      <PageLayout eyebrow="미니게임" title="슬롯머신" description={slotDesc}>
        <SlotMachine />
      </PageLayout>
      <SiteFooter />
    </>
  );
}
