import {NextRequest, NextResponse} from 'next/server';

import {supabaseServer} from '@/lib/supabase-server';
import {VoteResult, VoteType} from '@/types/vote';

export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get('date');
  const voterId = req.headers.get('x-voter-id') ?? '';

  if (!date) {
    return NextResponse.json({error: 'date required'}, {status: 400});
  }

  try {
    const {data, error} = await supabaseServer
      .from('menu_votes')
      .select('menu_key, up_count, down_count, voter_id, vote_type')
      .like('menu_key', `${date}_%`);

    if (error) {
      return NextResponse.json([] as VoteResult[]);
    }

    const grouped: Record<string, VoteResult> = {};
    for (const row of data ?? []) {
      if (!grouped[row.menu_key]) {
        grouped[row.menu_key] = {
          menuKey: row.menu_key,
          up_count: 0,
          down_count: 0,
          myVote: null,
        };
      }
      grouped[row.menu_key].up_count = row.up_count ?? 0;
      grouped[row.menu_key].down_count = row.down_count ?? 0;
      if (row.voter_id === voterId) {
        grouped[row.menu_key].myVote = row.vote_type as VoteType;
      }
    }

    return NextResponse.json(Object.values(grouped) as VoteResult[]);
  } catch {
    return NextResponse.json([] as VoteResult[]);
  }
};

export const POST = async (req: NextRequest) => {
  const voterId = req.headers.get('x-voter-id') ?? '';
  const body = await req.json();
  const {menu_key, vote_type} = body as {menu_key: string; vote_type: VoteType};

  if (!menu_key || !vote_type || !voterId) {
    return NextResponse.json({error: 'invalid payload'}, {status: 400});
  }

  try {
    const {error} = await supabaseServer.from('menu_votes').upsert(
      {menu_key, voter_id: voterId, vote_type},
      {onConflict: 'menu_key,voter_id'}
    );

    if (error) {
      return NextResponse.json({ok: true});
    }

    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json({ok: true});
  }
};
