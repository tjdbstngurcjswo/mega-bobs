import 'server-only';

import {parseRss, type ParsedItem} from '@/lib/news/parseRss';
import {NEWS_SOURCES, toRssUrl} from '@/lib/news/sources';

/**
 * 3사 RSS 를 모두 가져와 합치고, url 기준으로 중복(cross-keyword)을 제거한다.
 * 최신순으로 정렬해 반환한다.
 */
export const fetchNews = async (): Promise<ParsedItem[]> => {
  const results = await Promise.all(
    NEWS_SOURCES.map(async ({company, query}) => {
      try {
        const res = await fetch(toRssUrl(query), {
          headers: {'User-Agent': 'Mozilla/5.0 (compatible; MegaBobsBot/1.0)'},
          cache: 'no-store',
        });
        if (!res.ok) return [];
        return parseRss(await res.text(), company);
      } catch {
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
