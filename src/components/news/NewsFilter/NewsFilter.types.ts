import type { CompanyNews, NewsCompany } from '@/models/news';

export type NewsFilterId = 'all' | NewsCompany;

export type NewsFilterProps = {
  newsByFilter: Record<NewsFilterId, CompanyNews[]>;
  lastCrawledAt: string | null;
};
