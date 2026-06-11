import type { NewsItem } from '@/types/news';

export type NewsCardProps = Pick<
  NewsItem,
  'title' | 'description' | 'originallink' | 'pubDate' | 'source'
>;
