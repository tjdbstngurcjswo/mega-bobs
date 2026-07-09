'use client';

import { Clock, Wrench } from 'lucide-react';
import { useState } from 'react';

import { trackEvent } from '@/utils/ga';

import { GAME_ICON_MAP } from '../gameIcons';

import {
  cardBadgeClass,
  cardDescClass,
  cardHeaderClass,
  cardIconClass,
  cardNumberClass,
  cardTitleClass,
  cardToastClass,
  cardWrapperClass,
} from './GameCard.styles';
import type { GameCardProps } from './GameCard.types';

const EASTER_EGG_THRESHOLD = 5;

const GameCard = ({ slug, name, description, number }: GameCardProps) => {
  const [clickCount, setClickCount] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [isEasterEgg, setIsEasterEgg] = useState(false);

  const handleClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    trackEvent('event', 'game_coming_soon_click', { slug, count: next });
    const easter = next >= EASTER_EGG_THRESHOLD;
    if (easter && !isEasterEgg) {
      trackEvent('event', 'easter_egg_gamecard', { slug });
    }
    setIsEasterEgg(easter);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const Icon =
    GAME_ICON_MAP[slug as keyof typeof GAME_ICON_MAP] ?? GAME_ICON_MAP.ladder;

  return (
    <div
      className={cardWrapperClass}
      role="button"
      tabIndex={0}
      aria-label={`${name} — 준비 중`}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <span className={cardNumberClass} aria-hidden="true">
        {String(number).padStart(2, '0')}
      </span>
      <div className={cardHeaderClass}>
        <Icon size={15} strokeWidth={2} className={cardIconClass} />
        <h3 className={cardTitleClass}>{name}</h3>
      </div>
      <p className={cardDescClass}>{description}</p>
      <span className={cardBadgeClass}>준비 중</span>
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
};

export default GameCard;
