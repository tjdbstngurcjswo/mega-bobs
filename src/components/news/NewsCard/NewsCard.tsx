import Link from 'next/link';

import { getRelativeTime } from '@/utils/newsFormat';

import {
  cardMetaClass,
  compactTitleClass,
  compactWrapperClass,
  featuredDescClass,
  featuredTitleClass,
  featuredWrapperClass,
  sourceChipClass,
} from './NewsCard.styles';
import type { NewsCardProps } from './NewsCard.types';

const NewsCard = ({
  title,
  description,
  originallink,
  pubDate,
  source,
  variant,
}: NewsCardProps) => {
  const relativeTime = getRelativeTime(pubDate);

  if (variant === 'compact') {
    return (
      <Link
        href={originallink}
        target="_blank"
        rel="noopener noreferrer"
        className={compactWrapperClass}
      >
        <p className={compactTitleClass}>{title}</p>
        <div className={cardMetaClass}>
          <span>{source}</span>
          <span aria-hidden>·</span>
          <span>{relativeTime}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={originallink}
      target="_blank"
      rel="noopener noreferrer"
      className={featuredWrapperClass}
    >
      <span className={sourceChipClass}>{source}</span>
      <p className={featuredTitleClass}>{title}</p>
      <p className={featuredDescClass}>{description}</p>
      <span className={cardMetaClass}>{relativeTime}</span>
    </Link>
  );
};

export default NewsCard;
