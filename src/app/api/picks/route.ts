import {NextRequest, NextResponse} from 'next/server';

import {supabaseServer} from '@/lib/supabase-server';
import {PickResult, PickType} from '@/types/vote';

const PICK_TYPES: PickType[] = ['A', 'B', 'takeout', 'pass'];

const emptyResult = (date: string, myPick: PickType | null = null): PickResult => ({
  date,
  counts: {A: 0, B: 0, takeout: 0, pass: 0},
  myPick,
});

export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) {
    return NextResponse.json({error: 'date required'}, {status: 400});
  }

  const voterId = req.headers.get('x-voter-id') ?? '';

  try {
    const {data, error} = await supabaseServer
      .from('menu_picks')
      .select('pick_type, voter_id')
      .eq('date', date);

    if (error) return NextResponse.json(emptyResult(date), {status: 200});

    const counts: Record<PickType, number> = {A: 0, B: 0, takeout: 0, pass: 0};
    let myPick: PickType | null = null;

    for (const row of data ?? []) {
      const pt = row.pick_type as PickType;
      if (PICK_TYPES.includes(pt)) counts[pt] += 1;
      if (row.voter_id === voterId) myPick = pt;
    }

    return NextResponse.json({date, counts, myPick} satisfies PickResult);
  } catch {
    return NextResponse.json(emptyResult(date), {status: 200});
  }
};

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
      await supabaseServer
        .from('menu_picks')
        .delete()
        .match({voter_id: voterId, date});
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
