import 'server-only';

import { dedupeNews } from '@/lib/news/dedupeNews';
import { parseRss, type ParsedItem } from '@/lib/news/parseRss';
import { NEWS_SOURCES, toRssUrl } from '@/lib/news/sources';

const FETCH_TIMEOUT_MS = 10_000;

/**
 * 3사 RSS 를 모두 가져와 합치고, 제목 기준으로 중복을 제거한다.
 * Google News 는 매체마다 url 이 달라 같은 기사가 url 로는 걸러지지 않는다.
 * 최신순으로 정렬해 반환한다. 소스별 실패는 빈 배열로 강등하되 로그를 남긴다.
 */
export const fetchNews = async (): Promise<ParsedItem[]> => {
  const results = await Promise.all(
    NEWS_SOURCES.map(async ({ company, query }) => {
      try {
        const res = await fetch(toRssUrl(query), {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MegaBobsBot/1.0)',
          },
          cache: 'no-store',
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!res.ok) {
          console.error(`[news] ${company} RSS 응답 실패: HTTP ${res.status}`);
          return [];
        }
        return parseRss(await res.text(), company);
      } catch (err) {
        console.error(`[news] ${company} RSS 수집 실패:`, err);
        return [];
      }
    })
  );

  return dedupeNews(results.flat());
};
