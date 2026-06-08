import { NextRequest } from 'next/server';

import getMenu from '@/api/getMenu';
import { err, ok } from '@/lib/apiResponse';

export const GET = async (req: NextRequest) => {
  const apiKey = req.headers.get('x-api-key');
  const API_KEY = process.env.API_KEY;
  if (!API_KEY || apiKey !== API_KEY) return err('Unauthorized', 401);

  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  if (!start || !end) return err('Invalid params', 400);

  try {
    const data = await getMenu({ start, end });
    return ok(data);
  } catch (error: unknown) {
    return err(error instanceof Error ? error.message : 'Internal error', 500);
  }
};
