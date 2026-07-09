import { Gamepad2 } from 'lucide-react';
import type { Metadata } from 'next';

import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { FeaturedGameCard, GameCard, OddkitBanner } from '@/components/games';
import { GAMES } from '@/constants/games';
import { SITE_NAME } from '@/constants/site';
import { getBreadcrumbJsonLd } from '@/utils/jsonLd';

const gamesDesc = `${SITE_NAME} 사내 구성원을 위한 소소한 미니게임 모음`;

export const metadata: Metadata = {
  title: '미니게임',
  description: gamesDesc,
  alternates: { canonical: '/games' },
  openGraph: {
    title: `${SITE_NAME} ∙ 미니게임`,
    description: gamesDesc,
    url: '/games',
  },
  twitter: {
    title: `${SITE_NAME} ∙ 미니게임`,
    description: gamesDesc,
  },
};

export default function GamesPage() {
  const numberedGames = GAMES.map((game, index) => ({
    ...game,
    number: index + 1,
  }));
  const openGames = numberedGames.filter((game) => game.status === 'open');
  const comingSoonGames = numberedGames.filter(
    (game) => game.status !== 'open'
  );

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
        title={
          <span className="inline-flex items-center gap-2.5">
            <Gamepad2 size={26} strokeWidth={2} />
            <span>{`${SITE_NAME} 미니게임`}</span>
          </span>
        }
        description="사내 구성원을 위한 소소한 미니게임 모음"
      >
        <div className="flex flex-col gap-4">
          {openGames.map((game) => (
            <FeaturedGameCard key={game.slug} {...game} />
          ))}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {comingSoonGames.map((game) => (
              <GameCard key={game.slug} {...game} />
            ))}
          </div>
          <OddkitBanner />
        </div>
      </PageLayout>
      <SiteFooter />
    </>
  );
}
