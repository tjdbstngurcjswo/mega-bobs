import { NextRequest, NextResponse } from 'next/server';

import { extractGeo, isKoreaGeo } from '@/lib/geoHeaders';
import { supabaseServer } from '@/lib/supabaseServer';
import { RenewalFeedbackPayload } from '@/models/renewalFeedback';

/**
 * @route POST /api/renewal-feedback
 * @header x-voter-id - 익명 투표자 ID
 * @body { version, score, reason? }
 * @returns { ok: true }
 */
export const POST = async (req: NextRequest) => {
  const voterId = req.headers.get('x-voter-id') ?? '';

  if (!voterId) {
    return NextResponse.json({ error: 'x-voter-id required' }, { status: 400 });
  }

  const geo = extractGeo(req);
  if (!isKoreaGeo(geo)) {
    return NextResponse.json({ error: 'unavailable' }, { status: 403 });
  }

  let body: RenewalFeedbackPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { version, score, reason } = body;

  if (!version || typeof score !== 'number' || score < 1 || score > 5) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  const { error } = await supabaseServer.from('renewal_feedback').upsert(
    {
      version,
      voter_id: voterId,
      score,
      reason: reason?.trim() || null,
      ip: geo.ip,
      country: geo.country,
      region: geo.region,
      city: geo.city,
    },
    { onConflict: 'version,voter_id' }
  );

  if (error) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
};
