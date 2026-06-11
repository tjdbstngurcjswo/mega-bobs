import type { NewsItem } from '@/types/news';

import { NewsCard } from '../NewsCard';

type Props = { items: NewsItem[] };

const NewsList = ({ items }: Props) => {
  if (items.length === 0) {
    return (
      <p className="text-muted py-12 text-center text-[14px]">
        소식을 불러오지 못했어요
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <NewsCard key={item.originallink} {...item} />
      ))}
    </div>
  );
};

export default NewsList;
