import type { NewsCompany } from '@/models/news';

type NewsSource = { company: NewsCompany; query: string };

/**
 * 메가존 3사 — 정확 구문(따옴표) 검색으로 노이즈를 줄인다.
 * 구체적인 사명(자회사)을 먼저 둔다: fetchNews 의 url 중복제거가 첫 매치를
 * 유지하므로 '"메가존"' 이 먼저면 자회사 기사가 megazone 으로 잘못 분류된다.
 * Google News RSS 는 API 키가 필요 없다.
 */
export const NEWS_SOURCES: NewsSource[] = [
  { company: 'megazonecloud', query: '"메가존클라우드"' },
  { company: 'megazonesoft', query: '"메가존소프트"' },
  { company: 'megazone', query: '"메가존"' },
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
