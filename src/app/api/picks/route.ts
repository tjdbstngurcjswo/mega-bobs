import { NextRequest } from 'next/server';
import { z } from 'zod';

import { err, ok } from '@/lib/apiResponse';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseServer } from '@/lib/supabaseServer';
import { PickResult, PickType } from '@/models/vote';

const PICK_TYPES: PickType[] = ['COURSE_1', 'COURSE_2', 'TAKE_OUT', 'pass'];

const PostSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pick_type: z
    .enum(['COURSE_1', 'COURSE_2', 'TAKE_OUT', 'pass'])
    .nullable()
    .optional(),
});

export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return err('date required', 400);

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

    if (error) return ok(empty);

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

    return ok({ date, counts, myPick } satisfies PickResult);
  } catch {
    return ok(empty);
  }
};

export const POST = async (req: NextRequest) => {
  const voterId = req.headers.get('x-voter-id') ?? '';
  if (!voterId) return err('x-voter-id required', 400);

  if (!rateLimit(`pick:${voterId}`, 5, 60_000)) {
    return err('Too many requests', 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON', 400);
  }

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return err('Invalid request', 400, parsed.error.issues);
  }

  const { date, pick_type } = parsed.data;

  if (!pick_type) {
    try {
      const { error } = await supabaseServer
        .from('menu_picks')
        .delete()
        .match({ voter_id: voterId, date });
      if (error) return err(error.message, 500);
      return ok({ ok: true });
    } catch (error: unknown) {
      return err(error instanceof Error ? error.message : 'internal error', 500);
    }
  }

  try {
    // 기존 픽 삭제 후 새 픽 삽입 — 하루 단일 선택 보장
    // ⚠️ Supabase 대시보드에서 menu_picks(voter_id, date) unique constraint 추가 권장
    const { error: delError } = await supabaseServer
      .from('menu_picks')
      .delete()
      .match({ voter_id: voterId, date });
    if (delError) return err(delError.message, 500);

    const { error } = await supabaseServer
      .from('menu_picks')
      .insert({ voter_id: voterId, date, pick_type });
    if (error) return err(error.message, 500);

    return ok({ ok: true });
  } catch (error: unknown) {
    return err(error instanceof Error ? error.message : 'internal error', 500);
  }
};
