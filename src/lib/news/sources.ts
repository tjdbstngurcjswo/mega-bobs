import type {NewsCompany} from '@/types/news';

type NewsSource = {company: NewsCompany; query: string};

/**
 * 메가존 3사 — 정확 구문(따옴표) 검색으로 노이즈를 줄인다.
 * Google News RSS 는 API 키가 필요 없다.
 */
export const NEWS_SOURCES: NewsSource[] = [
  {company: 'megazone', query: '"메가존"'},
  {company: 'megazonecloud', query: '"메가존클라우드"'},
  {company: 'megazonesoft', query: '"메가존소프트"'},
];

export const toRssUrl = (query: string): string => {
  const params = new URLSearchParams({
    q: query,
    hl: 'ko',
    gl: 'KR',
    ceid: 'KR:ko',
  });
  return `https://news.google.com/rss/search?${params.toString()}`;
};
