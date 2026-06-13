import Link from 'next/link';

import type { GameDef } from '@/constants/games';

import {
  cardBadgeClass,
  cardContentClass,
  cardDescClass,
  cardIconClass,
  cardTitleClass,
  cardWrapperClass,
} from './GameCard.styles';

const GameCard = ({ slug, name, description, status, icon: Icon }: GameDef) => {
  const isComingSoon = status === 'coming_soon';

  const inner = (
    <div className={cardContentClass(isComingSoon)}>
      <div className="flex items-center gap-2">
        <Icon size={16} className={cardIconClass} />
        <h3 className={cardTitleClass}>{name}</h3>
        {isComingSoon && <span className={cardBadgeClass}>준비 중</span>}
      </div>
      <p className={cardDescClass}>{description}</p>
    </div>
  );

  if (isComingSoon) {
    return <div className={cardWrapperClass(true)}>{inner}</div>;
  }

  return (
    <Link href={`/games/${slug}`} className={cardWrapperClass(false)}>
      {inner}
    </Link>
  );
};

export default GameCard;
