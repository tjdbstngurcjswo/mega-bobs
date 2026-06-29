'use client';

import { Clock, Dices, Shuffle, Wrench, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { GameDef } from '@/constants/games';
import { trackEvent } from '@/utils/ga';

import {
  cardBadgeClass,
  cardContentClass,
  cardDescClass,
  cardIconClass,
  cardTitleClass,
  cardToastClass,
  cardWrapperClass,
} from './GameCard.styles';

const ICON_MAP = {
  ladder: Shuffle,
  slot: Dices,
  balloon: Zap,
} as const;

const EASTER_EGG_THRESHOLD = 5;

const GameCard = ({ slug, name, description, status }: GameDef) => {
  const isComingSoon = status === 'coming_soon';
  const [clickCount, setClickCount] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [isEasterEgg, setIsEasterEgg] = useState(false);

  const handleComingSoonClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    const easter = next >= EASTER_EGG_THRESHOLD;
    if (easter && !isEasterEgg) {
      trackEvent('event', 'easter_egg_gamecard', { slug });
    }
    setIsEasterEgg(easter);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const Icon = ICON_MAP[slug as keyof typeof ICON_MAP] ?? Shuffle;

  const innerContent = (
    <div className={cardContentClass(isComingSoon)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={16} strokeWidth={2} className={cardIconClass} />
          <h3 className={cardTitleClass}>{name}</h3>
        </div>
        {isComingSoon && <span className={cardBadgeClass}>준비 중</span>}
      </div>
      <p className={cardDescClass}>{description}</p>
    </div>
  );

  if (isComingSoon) {
    return (
      <div
        className={cardWrapperClass(true)}
        role="button"
        tabIndex={0}
        aria-label={`${name} — 준비 중`}
        onClick={handleComingSoonClick}
        onKeyDown={(e) => e.key === 'Enter' && handleComingSoonClick()}
      >
        {innerContent}
        {toastVisible && (
          <div className={cardToastClass(isEasterEgg)}>
            {isEasterEgg ? (
              <Wrench size={12} strokeWidth={2.5} />
            ) : (
              <Clock size={12} strokeWidth={2.5} />
            )}
            <span>{isEasterEgg ? '빨리 만들게요…' : '곧 오픈해요'}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={`/games/${slug}`} className={cardWrapperClass(false)}>
      {innerContent}
    </Link>
  );
};

export default GameCard;
