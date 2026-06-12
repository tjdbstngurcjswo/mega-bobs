'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { GameDef } from '@/constants/games';

import {
  cardBadgeClass,
  cardContentClass,
  cardDescClass,
  cardIconClass,
  cardTitleClass,
  cardToastClass,
  cardWrapperClass,
} from './GameCard.styles';

const LadderIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="7" y1="7" x2="17" y2="7" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="7" y1="17" x2="17" y2="17" />
  </svg>
);

const GameCard = ({ slug, name, description, status }: GameDef) => {
  const isComingSoon = status === 'coming_soon';
  const [toastVisible, setToastVisible] = useState(false);

  const handleComingSoonClick = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  if (isComingSoon) {
    return (
      <div
        className={cardWrapperClass(true)}
        role="button"
        tabIndex={0}
        aria-label="준비 중인 게임"
        onClick={handleComingSoonClick}
        onKeyDown={(e) => e.key === 'Enter' && handleComingSoonClick()}
      >
        <div className={cardContentClass(true)}>
          <div className="flex items-center justify-center py-2">
            <span className={cardBadgeClass}>준비 중</span>
          </div>
        </div>
        {toastVisible && (
          <div className={cardToastClass(false)}>
            <Clock size={12} strokeWidth={2.5} />
            <span>곧 오픈해요</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={`/games/${slug}`} className={cardWrapperClass(false)}>
      <div className={cardContentClass(false)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <LadderIcon size={16} className={cardIconClass} />
            <h3 className={cardTitleClass}>{name}</h3>
          </div>
        </div>
        <p className={cardDescClass}>{description}</p>
      </div>
    </Link>
  );
};

export default GameCard;
