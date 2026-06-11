'use client';

import { useState } from 'react';

import { NewsCard } from '../NewsCard';
import { loadMoreClass } from './NewsList.styles';
import type { NewsListProps } from './NewsList.types';

const PAGE_SIZE = 20;

const NewsList = ({ items }: NewsListProps) => {
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (items.length === 0) {
    return (
      <p className="text-muted py-12 text-center text-[14px]">
        소식을 불러오지 못했어요
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.slice(0, visible).map((item) => (
        <NewsCard
          key={item.originallink || item.pubDate + item.title}
          {...item}
        />
      ))}
      {visible < items.length && (
        <button
          type="button"
          className={loadMoreClass}
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
        >
          더 보기 ({items.length - visible}개 남음)
        </button>
      )}
    </div>
  );
};

export default NewsList;
