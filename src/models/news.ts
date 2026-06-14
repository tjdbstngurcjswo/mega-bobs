export type NewsCompany = 'megazone' | 'megazonecloud' | 'megazonesoft';

export type CompanyNews = {
  url: string;
  title: string;
  summary: string | null;
  source: string | null;
  company: NewsCompany;
  publishedAt: string; // ISO 8601
};

export const COMPANY_LABEL: Record<NewsCompany, string> = {
  megazone: '메가존',
  megazonecloud: '메가존클라우드',
  megazonesoft: '메가존소프트',
};
