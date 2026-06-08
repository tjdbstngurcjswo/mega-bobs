import { NextRequest, NextResponse } from 'next/server';

import { supabaseServer } from '@/lib/supabaseServer';
import { PickResult, PickType } from '@/models/vote';

const PICK_TYPES: PickType[] = ['COURSE_1', 'COURSE_2', 'TAKE_OUT', 'pass'];

export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) {
    return NextResponse.json({ error: 'date required' }, { status: 400 });
  }

  const voterId = req.headers.get('x-voter-id') ?? '';

  const empty: PickResult = {
    date,
    counts: { COURSE_1: 0, COURSE_2: 0, TAKE_OUT: 0, pass: 0 },
    myPick: null,
  };

  try {
    const { data, error } = await supabaseServer
      .from('menu_picks')
      .select('pick_type, voter_id')
      .eq('date', date);

    if (error) return NextResponse.json(empty, { status: 200 });

    const counts: Record<PickType, number> = {
      COURSE_1: 0,
      COURSE_2: 0,
      TAKE_OUT: 0,
      pass: 0,
    };
    let myPick: PickType | null = null;

    // voter_id별 최신 1개만 집계 — 중복 행 방어
    const seen = new Set<string>();
    for (const row of data ?? []) {
      const pt = row.pick_type as PickType;
      if (!PICK_TYPES.includes(pt)) continue;
      if (seen.has(row.voter_id)) continue;
      seen.add(row.voter_id);
      counts[pt] += 1;
      if (row.voter_id === voterId) myPick = pt;
    }

    return NextResponse.json({ date, counts, myPick } satisfies PickResult);
  } catch {
    return NextResponse.json(empty, { status: 200 });
  }
};

export const POST = async (req: NextRequest) => {
  const voterId = req.headers.get('x-voter-id') ?? '';
  if (!voterId) {
    return NextResponse.json({ error: 'x-voter-id required' }, { status: 400 });
  }

  let body: { date?: string; pick_type?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { date, pick_type: pickType } = body;
  if (!date) {
    return NextResponse.json({ error: 'date required' }, { status: 400 });
  }

  const { error: delError } = await supabaseServer
    .from('menu_picks')
    .delete()
    .match({ voter_id: voterId, date });
  if (delError)
    return NextResponse.json({ error: delError.message }, { status: 500 });

  if (!pickType) return NextResponse.json({ ok: true });

  if (!PICK_TYPES.includes(pickType as PickType)) {
    return NextResponse.json({ error: 'invalid pick_type' }, { status: 400 });
  }

  // 기존 픽 삭제 후 새 픽 삽입 — 하루 단일 선택 보장
  const { error } = await supabaseServer
    .from('menu_picks')
    .insert({ voter_id: voterId, date, pick_type: pickType });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
};
