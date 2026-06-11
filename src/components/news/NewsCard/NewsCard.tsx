import Link from 'next/link';

import dayjs from '@/lib/dayjs';
import type { NewsItem } from '@/types/news';

import {
  cardDescClass,
  cardLinkClass,
  cardMetaClass,
  cardTitleClass,
  cardWrapperClass,
} from './NewsCard.styles';

type Props = Pick<
  NewsItem,
  'title' | 'description' | 'originallink' | 'pubDate' | 'source'
>;

const NewsCard = ({
  title,
  description,
  originallink,
  pubDate,
  source,
}: Props) => (
  <article className={cardWrapperClass}>
    <p className={cardTitleClass}>{title}</p>
    <p className={cardDescClass}>{description}</p>
    <div className={cardMetaClass}>
      <span>{source}</span>
      <span aria-hidden>·</span>
      <span>{dayjs(pubDate).tz().format('YYYY.MM.DD')}</span>
      <Link
        href={originallink}
        target="_blank"
        rel="noopener noreferrer"
        className={cardLinkClass}
      >
        원문 →
      </Link>
    </div>
  </article>
);

export default NewsCard;
