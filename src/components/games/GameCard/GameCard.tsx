import Link from 'next/link';

import type { GameDef } from '@/constants/games';

import {
  cardBadgeClass,
  cardClass,
  cardDescClass,
  cardTitleClass,
} from './GameCard.styles';

const GameCard = ({ slug, name, description, status }: GameDef) => {
  const isComingSoon = status === 'coming_soon';

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className={cardTitleClass}>{name}</h3>
        {isComingSoon && <span className={cardBadgeClass}>준비 중</span>}
      </div>
      <p className={cardDescClass}>{description}</p>
    </>
  );

  if (isComingSoon) {
    return <div className={cardClass(true)}>{content}</div>;
  }

  return (
    <Link href={`/games/${slug}`} className={cardClass(false)}>
      {content}
    </Link>
  );
};

export default GameCard;
