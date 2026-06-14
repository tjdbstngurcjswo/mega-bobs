import { NextRequest } from 'next/server';

import getNews from '@/api/getNews';
import type { NewsCompany } from '@/models/news';

const VALID_COMPANIES = new Set<string>([
  'megazone',
  'megazonecloud',
  'megazonesoft',
]);

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const companyParam = searchParams.get('company');
  const offsetParam = searchParams.get('offset');
  const limitParam = searchParams.get('limit');

  const company =
    companyParam && VALID_COMPANIES.has(companyParam)
      ? (companyParam as NewsCompany)
      : undefined;
  const offset = Math.max(0, Number(offsetParam) || 0);
  const limit = Math.min(50, Math.max(1, Number(limitParam) || 20));

  try {
    const data = await getNews({ company, offset, limit });
    return json(data, 200);
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Internal error';
    return json({ error }, 500);
  }
};
