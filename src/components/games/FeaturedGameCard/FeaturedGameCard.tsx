'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { trackEvent } from '@/utils/ga';

import { getGameIcon } from '../gameIcons';

import {
  ctaClass,
  descClass,
  headerBadgeClass,
  titleClass,
  wrapperClass,
} from './FeaturedGameCard.styles';
import type { FeaturedGameCardProps } from './FeaturedGameCard.types';

const FeaturedGameCard = ({
  slug,
  name,
  description,
}: FeaturedGameCardProps) => {
  const Icon = getGameIcon(slug);

  const handleClick = () => {
    trackEvent('event', 'game_open_click', { slug, name });
  };

  return (
    <Link
      href={`/games/${slug}`}
      className={wrapperClass}
      onClick={handleClick}
    >
      <div>
        <span className={headerBadgeClass}>지금 플레이 가능</span>
        <h2 className={titleClass}>
          <Icon size={20} strokeWidth={2} className="text-muted shrink-0" />
          {name}
        </h2>
        <p className={descClass}>{description}</p>
      </div>
      <span className={ctaClass}>
        플레이하기
        <ArrowRight size={15} strokeWidth={2} />
      </span>
    </Link>
  );
};

export default FeaturedGameCard;
