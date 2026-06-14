import dayjs from '@/lib/dayjs';

import {
  cardClass,
  dateClass,
  linkLabelClass,
  sourceChipClass,
  summaryClass,
  titleClass,
} from './NewsCard.styles';
import type { NewsCardProps } from './NewsCard.types';

const NewsCard = ({ news }: NewsCardProps) => (
  <a
    href={news.url}
    target="_blank"
    rel="noopener noreferrer"
    className={cardClass}
  >
    {news.source && <span className={sourceChipClass}>{news.source}</span>}

    <div className="min-w-0 flex-1">
      <h3 className={titleClass}>{news.title}</h3>
      {news.summary && <p className={summaryClass}>{news.summary}</p>}
      <div className={dateClass}>
        {dayjs(news.publishedAt).tz().format('YYYY.M.D')}
      </div>
    </div>

    <span className={linkLabelClass}>
      원문 보기 <span aria-hidden="true">↗</span>
    </span>
  </a>
);

export default NewsCard;
