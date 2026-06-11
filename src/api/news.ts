import type { NaverNewsResponse, NewsResult } from '@/types/news';
import { getSourceFromUrl, stripHtml } from '@/utils/newsFormat';

export const getNews = async (): Promise<NewsResult> => {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // eslint-disable-next-line no-console
    console.warn('[news] NAVER_CLIENT_ID or NAVER_CLIENT_SECRET not set');
    return { items: [], error: false };
  }

  try {
    const res = await fetch(
      'https://openapi.naver.com/v1/search/news.json?query=%EB%A9%94%EA%B0%80%EC%A1%B4&display=100&sort=date',
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return { items: [], error: true };

    const data = (await res.json()) as NaverNewsResponse;

    return {
      items: (data.items ?? []).map((item) => ({
        title: stripHtml(item.title),
        description: stripHtml(item.description),
        originallink: item.originallink || item.link,
        pubDate: item.pubDate,
        source: getSourceFromUrl(item.originallink || item.link),
      })),
      error: false,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[news] Failed to fetch news:', err);
    return { items: [], error: true };
  }
};
