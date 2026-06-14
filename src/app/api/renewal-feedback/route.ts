import { NextRequest, NextResponse } from 'next/server';

import { extractGeo, isKoreaGeo } from '@/lib/geoHeaders';
import { supabaseServer } from '@/lib/supabaseServer';
import { RenewalFeedbackPayload } from '@/models/renewalFeedback';

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

  const { version, score, reason, page } = body;

  if (!version || typeof score !== 'number' || score < 1 || score > 5) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  const { error } = await supabaseServer.from('renewal_feedback').insert({
    version,
    voter_id: voterId,
    score,
    reason: reason?.trim() || null,
    page: page ?? null,
    ip: geo.ip,
    country: geo.country,
    region: geo.region,
    city: geo.city,
  });

  if (error) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
};
