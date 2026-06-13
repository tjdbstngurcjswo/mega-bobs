import type { Metadata } from 'next';

import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { GameCard } from '@/components/@shared';
import { GAMES } from '@/constants/games';
import { SITE_NAME } from '@/constants/site';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';

const gamesDesc = `${SITE_NAME} 사내 구성원을 위한 소소한 미니게임 모음`;

export const metadata: Metadata = {
  title: '미니게임',
  description: gamesDesc,
  alternates: { canonical: '/games' },
  openGraph: {
    title: `미니게임 — ${SITE_NAME}`,
    description: gamesDesc,
    url: '/games',
  },
};

export default function GamesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', path: '/' },
              { name: '미니게임', path: '/games' },
            ])
          ),
        }}
      />
      <SiteHeader />
      <PageLayout
        eyebrow="미니게임"
        title={`${SITE_NAME} 미니게임`}
        description="사내 구성원을 위한 소소한 미니게임 모음"
      >
        <div className="flex flex-col gap-3">
          {GAMES.map((game) => (
            <GameCard key={game.slug} {...game} />
          ))}
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
