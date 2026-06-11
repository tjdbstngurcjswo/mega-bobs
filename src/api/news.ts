import type { NaverNewsResponse, NewsItem } from '@/types/news';
import { getSourceFromUrl, stripHtml } from '@/utils/newsFormat';

export const getNews = async (): Promise<NewsItem[]> => {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // eslint-disable-next-line no-console
    console.warn('[news] NAVER_CLIENT_ID or NAVER_CLIENT_SECRET not set');
    return [];
  }

  try {
    const res = await fetch(
      'https://openapi.naver.com/v1/search/news.json?query=%EB%A9%94%EA%B0%80%EC%A1%B4%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C&display=20&sort=date',
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = (await res.json()) as NaverNewsResponse;

    return (data.items ?? []).map((item) => ({
      title: stripHtml(item.title),
      description: stripHtml(item.description),
      originallink: item.originallink || item.link,
      pubDate: item.pubDate,
      source: getSourceFromUrl(item.originallink || item.link),
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[news] Failed to fetch news:', err);
    return [];
  }
};
