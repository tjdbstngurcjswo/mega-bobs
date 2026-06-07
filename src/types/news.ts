export type NewsCompany = 'megazone' | 'megazonecloud' | 'megazonesoft';

export type CompanyNews = {
  url: string;
  title: string;
  summary: string | null;
  source: string | null;
  company: NewsCompany;
  publishedAt: string; // ISO 8601
};
