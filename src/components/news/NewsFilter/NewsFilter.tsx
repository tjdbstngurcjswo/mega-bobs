'use client';

import { useState } from 'react';

import type { CompanyNews } from '@/models/news';
import dayjs from '@/lib/dayjs';

import NewsCard from '../NewsCard';
import { FILTER_OPTIONS } from './NewsFilter.constants';
import {
  dateHeaderClass,
  emptyClass,
  emptyTitleClass,
  filterBarClass,
  filterButtonClass,
  loadMoreClass,
  newDotClass,
  newsGroupClass,
} from './NewsFilter.styles';
import type { NewsFilterId, NewsFilterProps } from './NewsFilter.types';

const PAGE_SIZE = 20;

type FilterState = {
  items: CompanyNews[];
  hasMore: boolean;
  loading: boolean;
};

const NewsFilter = ({ newsByFilter }: NewsFilterProps) => {
  const [active, setActive] = useState<NewsFilterId>('all');
  const [states, setStates] = useState<Record<NewsFilterId, FilterState>>(
    () => {
      const init = (id: NewsFilterId): FilterState => ({
        items: newsByFilter[id],
        hasMore: newsByFilter[id].length === PAGE_SIZE,
        loading: false,
      });
      return {
        all: init('all'),
        megazone: init('megazone'),
        megazonecloud: init('megazonecloud'),
        megazonesoft: init('megazonesoft'),
      };
    }
  );

  const { items, hasMore, loading } = states[active];

  const loadMore = async () => {
    setStates((prev) => ({
      ...prev,
      [active]: { ...prev[active], loading: true },
    }));

    const params = new URLSearchParams({
      offset: String(items.length),
      limit: String(PAGE_SIZE),
    });
    if (active !== 'all') params.set('company', active);

    const res = await fetch(`/api/news?${params}`);
    if (!res.ok) {
      setStates((prev) => ({
        ...prev,
        [active]: { ...prev[active], loading: false },
      }));
      return;
    }
    const next: CompanyNews[] = await res.json();

    setStates((prev) => ({
      ...prev,
      [active]: {
        items: [...prev[active].items, ...next],
        hasMore: next.length === PAGE_SIZE,
        loading: false,
      },
    }));
  };

  const today = dayjs().tz().format('YYYY-MM-DD');

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = dayjs(item.publishedAt).tz().format('YYYY-MM-DD');
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

  const dateGroups = Object.entries(grouped).sort(([a], [b]) =>
    b.localeCompare(a)
  );

  return (
    <div>
      <div className={filterBarClass}>
        {FILTER_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={filterButtonClass(active === id)}
            aria-pressed={active === id}
          >
            {label}
          </button>
        ))}
      </div>

      {items.length > 0 ? (
        <>
          <div className="flex flex-col gap-8">
            {dateGroups.map(([dateKey, group]) => (
              <div key={dateKey} className={newsGroupClass}>
                <p className={dateHeaderClass}>
                  {dayjs(dateKey).tz().format('M월 D일 dddd')}
                  {dateKey === today && (
                    <span className={newDotClass} aria-label="오늘" />
                  )}
                </p>
                {group.map((item) => (
                  <NewsCard key={item.url} news={item} />
                ))}
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className={loadMoreClass}
            >
              {loading ? '불러오는 중…' : '더보기'}
            </button>
          )}
        </>
      ) : (
        <div className={emptyClass}>
          <p className={emptyTitleClass}>해당하는 소식이 없어요</p>
        </div>
      )}
    </div>
  );
};

export default NewsFilter;
