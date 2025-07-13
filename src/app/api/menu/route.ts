import {NextRequest} from 'next/server';

import {supabase} from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    return new Response(JSON.stringify({message: 'Invalid params'}), {
      status: 400,
      headers: {'Content-Type': 'application/json'},
    });
  }

  const {data, error} = await supabase
    .from('daily_menu')
    .select('*')
    .eq('date', date);

  if (error || !data) {
    return new Response(
      JSON.stringify({message: error?.message || 'Not found'}),
      {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      }
    );
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });
}
