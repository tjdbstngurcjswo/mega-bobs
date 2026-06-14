import 'server-only';

import { supabaseServer } from '@/lib/supabaseServer';
import type { CompanyNews, NewsCompany } from '@/models/news';

type NewsRow = {
  url: string;
  title: string;
  summary: string | null;
  source: string | null;
  company: NewsCompany;
  published_at: string;
};

type GetNewsOptions = {
  limit?: number;
  offset?: number;
  company?: NewsCompany;
};

const toCompanyNews = (row: NewsRow): CompanyNews => ({
  url: row.url,
  title: row.title,
  summary: row.summary,
  source: row.source,
  company: row.company,
  publishedAt: row.published_at,
});

const getNews = async ({
  limit = 20,
  offset = 0,
  company,
}: GetNewsOptions = {}): Promise<CompanyNews[]> => {
  let query = supabaseServer
    .from('company_news')
    .select('url, title, summary, source, company, published_at')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (company) {
    query = query.eq('company', company);
  }

  const { data, error } = await query;

  if (error) {
    // 테이블 미생성(42P01)은 빈 상태로 강등 — 배포가 수동 SQL 실행 순서에 묶이지 않도록
    if (error.code === '42P01') {
      console.error(
        '[news] company_news 테이블이 없습니다 — docs/db/company_news.sql 실행 필요'
      );
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []).map(toCompanyNews);
};

export const getLastCrawledAt = async (): Promise<string | null> => {
  const { data, error } = await supabaseServer
    .from('company_news')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data?.created_at ?? null;
};

export default getNews;
