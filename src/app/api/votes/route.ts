import {NextRequest, NextResponse} from 'next/server';

import {supabaseServer} from '@/lib/supabaseServer';
import {VoteResult, VoteType} from '@/api/vote.types';

/**
 * @route GET /api/votes
 * @header x-voter-id - 익명 투표자 ID
 * @query date - 조회할 날짜 (YYYY-MM-DD)
 * @returns 해당 날짜의 코스별 투표 집계 목록
 */
export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get('date');
  const voterId = req.headers.get('x-voter-id') ?? '';

  if (!date) {
    return NextResponse.json({error: 'date required'}, {status: 400});
  }

  try {
    const {data, error} = await supabaseServer
      .from('menu_votes')
      .select('menu_key, vote_type, voter_id')
      .eq('date', date);

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
      if (row.vote_type === 'up') grouped[row.menu_key].up_count++;
      else grouped[row.menu_key].down_count++;
      if (row.voter_id === voterId) {
        grouped[row.menu_key].myVote = row.vote_type as VoteType;
      }
    }

    return NextResponse.json(Object.values(grouped) as VoteResult[]);
  } catch {
    return NextResponse.json([] as VoteResult[]);
  }
};

/**
 * @route POST /api/votes
 * @header x-voter-id - 익명 투표자 ID
 * @body `{ menu_key, date, vote_type }` — vote_type이 null이면 투표 취소
 * @returns `{ ok: true }`
 */
export const POST = async (req: NextRequest) => {
  const voterId = req.headers.get('x-voter-id') ?? '';

  let body: {menu_key?: string; vote_type?: VoteType | null; date?: string};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({error: 'invalid json'}, {status: 400});
  }

  const {menu_key, vote_type, date} = body;

  if (!menu_key || !date || !voterId) {
    return NextResponse.json({error: 'invalid payload'}, {status: 400});
  }

  try {
    const {error} = vote_type
      ? await supabaseServer.rpc('vote_or_switch', {
          p_voter_id: voterId,
          p_menu_key: menu_key,
          p_date: date,
          p_vote_type: vote_type,
        })
      : await supabaseServer.rpc('cancel_vote', {
          p_voter_id: voterId,
          p_date: date,
        });

    if (error) return NextResponse.json({error: error.message}, {status: 500});

    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json({error: 'server error'}, {status: 500});
  }
};
