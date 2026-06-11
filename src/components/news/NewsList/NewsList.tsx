'use client';

import { useState } from 'react';

import { NewsCard } from '../NewsCard';
import {
  emptyDescClass,
  emptyStateClass,
  emptyTitleClass,
  loadMoreClass,
} from './NewsList.styles';
import type { NewsListProps } from './NewsList.types';

const PAGE_SIZE = 20;

const NewsList = ({ items, error }: NewsListProps) => {
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (error) {
    return (
      <div className={emptyStateClass}>
        <p className={emptyTitleClass}>소식을 불러오지 못했어요</p>
        <p className={emptyDescClass}>잠시 후 다시 시도해주세요</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={emptyStateClass}>
        <p className={emptyTitleClass}>아직 소식이 없어요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.slice(0, visible).map((item, idx) => (
        <NewsCard
          key={item.originallink || item.pubDate + item.title}
          {...item}
          variant={idx === 0 ? 'featured' : 'compact'}
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
