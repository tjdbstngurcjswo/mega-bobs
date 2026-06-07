import {NextRequest} from 'next/server';

import getMenu from '@/api/getMenu';

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
  });

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== process.env.API_KEY) return json({message: 'Unauthorized'}, 401);

  const {searchParams} = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  if (!start || !end) return json({message: 'Invalid params'}, 400);

  try {
    const data = await getMenu({start, end});
    return json(data, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return json({message}, 500);
  }
}
