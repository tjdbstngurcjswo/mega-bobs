import {NextRequest} from 'next/server';

import {supabase} from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const date = searchParams.get('date');
  const category = searchParams.get('category');

  if (!date || !category) {
    return new Response(JSON.stringify({message: 'Invalid params'}), {
      status: 400,
      headers: {'Content-Type': 'application/json'},
    });
  }

  const {data, error} = await supabase
    .from('daily_menu')
    .select('*')
    .eq('date', date)
    .eq('category', category)
    .single();

  // supabase에서 데이터가 없을 때 error.code가 'PGRST116'임
  if (error && error.code !== 'PGRST116') {
    return new Response(JSON.stringify({message: error.message}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }

  // 데이터가 없을 때도 200으로 응답
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });
}
