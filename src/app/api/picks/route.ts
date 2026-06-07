import {NextRequest, NextResponse} from 'next/server';

import {supabaseServer} from '@/lib/supabaseServer';
import {PickResult, PickType} from '@/api/vote.types';

const PICK_TYPES: PickType[] = ['COURSE_1', 'COURSE_2', 'TAKE_OUT', 'pass'];

/**
 * @route GET /api/picks
 * @header x-voter-id - 익명 투표자 ID
 * @query date - 조회할 날짜 (YYYY-MM-DD)
 * @returns 해당 날짜의 코스 픽 집계 및 내 선택
 */
export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) {
    return NextResponse.json({error: 'date required'}, {status: 400});
  }

  const voterId = req.headers.get('x-voter-id') ?? '';

  const empty: PickResult = {date, counts: {COURSE_1: 0, COURSE_2: 0, TAKE_OUT: 0, pass: 0}, myPick: null};

  try {
    const {data, error} = await supabaseServer
      .from('menu_picks')
      .select('pick_type, voter_id')
      .eq('date', date);

    if (error) return NextResponse.json(empty, {status: 200});

    const counts: Record<PickType, number> = {COURSE_1: 0, COURSE_2: 0, TAKE_OUT: 0, pass: 0};
    let myPick: PickType | null = null;

    for (const row of data ?? []) {
      const pt = row.pick_type as PickType;
      if (PICK_TYPES.includes(pt)) counts[pt] += 1;
      if (row.voter_id === voterId) myPick = pt;
    }

    return NextResponse.json({date, counts, myPick} satisfies PickResult);
  } catch {
    return NextResponse.json(empty, {status: 200});
  }
};

/**
 * @route POST /api/picks
 * @header x-voter-id - 익명 투표자 ID
 * @body `{ date, pick_type }` — pick_type이 null이면 기존 픽 취소
 * @returns `{ ok: true }`
 */
export const POST = async (req: NextRequest) => {
  const voterId = req.headers.get('x-voter-id') ?? '';
  if (!voterId) {
    return NextResponse.json({error: 'x-voter-id required'}, {status: 400});
  }

  let body: {date?: string; pick_type?: string};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({error: 'invalid json'}, {status: 400});
  }

  const {date, pick_type} = body;
  if (!date) {
    return NextResponse.json({error: 'date required'}, {status: 400});
  }

  // pick_type이 null이면 취소
  if (!pick_type) {
    try {
      const {error} = await supabaseServer
        .from('menu_picks')
        .delete()
        .match({voter_id: voterId, date});
      if (error) return NextResponse.json({error: error.message}, {status: 500});
      return NextResponse.json({ok: true});
    } catch {
      return NextResponse.json({error: 'internal error'}, {status: 500});
    }
  }

  if (!PICK_TYPES.includes(pick_type as PickType)) {
    return NextResponse.json({error: 'invalid pick_type'}, {status: 400});
  }

  try {
    const {error} = await supabaseServer.from('menu_picks').upsert(
      {voter_id: voterId, date, pick_type},
      {onConflict: 'voter_id,date'}
    );

    if (error) return NextResponse.json({error: error.message}, {status: 500});

    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json({error: 'internal error'}, {status: 500});
  }
};
