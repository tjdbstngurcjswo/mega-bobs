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

const toCompanyNews = (row: NewsRow): CompanyNews => ({
  url: row.url,
  title: row.title,
  summary: row.summary,
  source: row.source,
  company: row.company,
  publishedAt: row.published_at,
});

/**
 * Supabase `company_news` 테이블에서 최신 뉴스를 조회한다.
 * @param limit - 최대 조회 건수 (기본 30)
 */
const getNews = async (limit = 30): Promise<CompanyNews[]> => {
  const { data, error } = await supabaseServer
    .from('company_news')
    .select('url, title, summary, source, company, published_at')
    .order('published_at', { ascending: false })
    .limit(limit);

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

export default getNews;
