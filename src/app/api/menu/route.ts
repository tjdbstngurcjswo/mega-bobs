import {NextRequest} from 'next/server';

import {supabaseServer} from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!start || !end) {
    return new Response(JSON.stringify({message: 'Invalid params'}), {
      status: 400,
      headers: {'Content-Type': 'application/json'},
    });
  }

  const {data, error} = await supabaseServer
    .from('daily_menu')
    .select('*')
    .gte('date', start)
    .lte('date', end);

  if (error) {
    return new Response(JSON.stringify({message: error.message}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });
}
