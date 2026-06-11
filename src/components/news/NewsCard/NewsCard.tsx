import Link from 'next/link';

import dayjs from '@/lib/dayjs';

import {
  cardDescClass,
  cardMetaClass,
  cardTitleClass,
  cardWrapperClass,
} from './NewsCard.styles';
import type { NewsCardProps } from './NewsCard.types';

const NewsCard = ({
  title,
  description,
  originallink,
  pubDate,
  source,
}: NewsCardProps) => (
  <Link
    href={originallink}
    target="_blank"
    rel="noopener noreferrer"
    className={cardWrapperClass}
  >
    <p className={cardTitleClass}>{title}</p>
    <p className={cardDescClass}>{description}</p>
    <div className={cardMetaClass}>
      <span>{source}</span>
      <span aria-hidden>·</span>
      <span>{dayjs(pubDate).tz().format('YYYY.MM.DD')}</span>
    </div>
  </Link>
);

export default NewsCard;
