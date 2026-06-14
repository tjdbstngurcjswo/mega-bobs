import { ExternalLink } from 'lucide-react';

import dayjs from '@/lib/dayjs';

import {
  cardClass,
  dateClass,
  linkLabelClass,
  titleClass,
} from './NewsCard.styles';
import type { NewsCardProps } from './NewsCard.types';

const NewsCard = ({ news }: NewsCardProps) => (
  <a
    href={news.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${news.title} (새 탭에서 열립니다)`}
    title="원문으로 이동"
    className={cardClass}
  >
    <div className="min-w-0 flex-1 max-sm:pr-6">
      <div className="mb-1 flex items-center gap-2">
        {news.source && <span className={dateClass}>{news.source}</span>}
        <span className={dateClass}>
          {dayjs(news.publishedAt).tz().format('YYYY.M.D')}
        </span>
      </div>
      <h3 className={titleClass}>{news.title}</h3>
    </div>

    <ExternalLink
      size={14}
      strokeWidth={2.5}
      className={linkLabelClass}
      aria-hidden="true"
    />
  </a>
);

export default NewsCard;
