import 'server-only';

import {supabaseServer} from '@/lib/supabase-server';
import type {CompanyNews, NewsCompany} from '@/types/news';

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

const getNews = async (limit = 30): Promise<CompanyNews[]> => {
  const {data, error} = await supabaseServer
    .from('company_news')
    .select('url, title, summary, source, company, published_at')
    .order('published_at', {ascending: false})
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map(toCompanyNews);
};

export default getNews;
