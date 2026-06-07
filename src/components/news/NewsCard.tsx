import dayjs from '@/lib/dayjs';
import type {CompanyNews} from '@/types/news';

type Props = {news: CompanyNews};

const NewsCard = ({news}: Props) => (
  <a
    href={news.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group border-line hover:border-ink flex items-start gap-4 border bg-white px-5 py-4 transition-colors max-[560px]:flex-col max-[560px]:gap-2"
  >
    {news.source && (
      <span className="bg-accent-soft text-accent-text mt-0.5 shrink-0 px-2.5 py-1 text-[11.5px] font-extrabold">
        {news.source}
      </span>
    )}

    <div className="min-w-0 flex-1">
      <h3 className="text-ink text-[15.5px] leading-snug font-extrabold tracking-[-0.01em]">
        {news.title}
      </h3>
      {news.summary && (
        <p className="text-muted mt-1 text-[13px] leading-relaxed">
          {news.summary}
        </p>
      )}
      <div className="text-muted mt-1.5 text-xs">
        {dayjs.tz(news.publishedAt).format('YYYY.M.D')}
      </div>
    </div>

    <span className="text-accent-deep group-hover:text-accent-text mt-0.5 shrink-0 text-[13px] font-bold whitespace-nowrap max-[560px]:mt-0">
      원문 보기 ↗
    </span>
  </a>
);

export default NewsCard;
