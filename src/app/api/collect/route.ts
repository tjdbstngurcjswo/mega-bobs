import { NextRequest, NextResponse } from 'next/server';

import { BEACON_MAX_BODY_BYTES } from '@/constants/beacon';
import { forwardBatch } from '@/lib/beacon/collect';
import isOwnBatch from '@/lib/beacon/isOwnBatch';

/**
 * @route POST /api/collect
 * @description beacon SDK 배치를 hongsoohyuk.com 수집 서버로 전달하는 같은 오리진 프록시.
 * SDK는 Content-Type 없이(text/plain) 보내므로 본문을 문자열로 읽는다.
 * @returns 204 — 수집 서버가 거절하면 그 상태 코드, 연결 실패는 502 (SDK가 재시도)
 */
export const POST = async (req: NextRequest) => {
  const body = await req.text();

  if (new TextEncoder().encode(body).length > BEACON_MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 });
  }
  if (!isOwnBatch(body)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  try {
    const res = await forwardBatch(body, req.headers.get('user-agent'));
    return new NextResponse(null, { status: res.ok ? 204 : res.status });
  } catch {
    return NextResponse.json(
      { error: 'collector unreachable' },
      { status: 502 }
    );
  }
};
