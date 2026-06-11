// src/types/news.ts
export type NaverNewsItem = {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
};

export type NaverNewsResponse = {
  items: NaverNewsItem[];
};

export type NewsItem = {
  title: string;
  description: string;
  originallink: string;
  pubDate: string;
  source: string;
};
