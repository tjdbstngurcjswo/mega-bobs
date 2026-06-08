import { NextRequest } from 'next/server';
import { z } from 'zod';

import { err, ok } from '@/lib/apiResponse';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseServer } from '@/lib/supabaseServer';
import { VoteResult, VoteType } from '@/models/vote';

const PostSchema = z.object({
  menu_key: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  vote_type: z.enum(['up', 'down']).nullable(),
});

export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get('date');
  const voterId = req.headers.get('x-voter-id') ?? '';

  if (!date) return err('date required', 400);

  try {
    const { data, error } = await supabaseServer
      .from('menu_votes')
      .select('menu_key, vote_type, voter_id')
      .eq('date', date);

    if (error) return ok([] as VoteResult[]);

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

    return ok(Object.values(grouped) as VoteResult[]);
  } catch {
    return ok([] as VoteResult[]);
  }
};

export const POST = async (req: NextRequest) => {
  const voterId = req.headers.get('x-voter-id') ?? '';

  if (!rateLimit(`vote:${voterId}`, 10, 60_000)) {
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

  const { menu_key, vote_type, date } = parsed.data;

  if (!voterId) return err('x-voter-id required', 400);

  try {
    const { error } = vote_type
      ? await supabaseServer.rpc('vote_or_switch', {
          p_voter_id: voterId,
          p_menu_key: menu_key,
          p_date: date,
          p_vote_type: vote_type,
        })
      : await supabaseServer.rpc('cancel_vote', {
          p_voter_id: voterId,
          p_menu_key: menu_key,
          p_date: date,
        });

    if (error) return err(error.message, 500);

    return ok({ ok: true });
  } catch (error: unknown) {
    return err(error instanceof Error ? error.message : 'server error', 500);
  }
};
