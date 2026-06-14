import 'server-only';

import { parseRss, type ParsedItem } from '@/lib/news/parseRss';
import { NEWS_SOURCES, toRssUrl } from '@/lib/news/sources';

const FETCH_TIMEOUT_MS = 10_000;

/**
 * 3사 RSS 를 모두 가져와 합치고, url 기준으로 중복(cross-keyword)을 제거한다.
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

  const byUrl = new Map<string, ParsedItem>();
  for (const item of results.flat()) {
    if (!byUrl.has(item.url)) byUrl.set(item.url, item);
  }

  return [...byUrl.values()].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};
