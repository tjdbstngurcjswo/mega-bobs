import 'server-only';

import type { BatchPayload } from 'hongsoohyuk-beacon';

import { BEACON_COLLECT_URL, BEACON_SITE_ID } from '@/constants/beacon';
import { isProd, SITE_URL } from '@/utils/env';

type ServerEvent = Omit<
  BatchPayload['events'][number],
  'anonId' | 'sessionId' | 'referrer' | 'utm'
>;

type ServerBatch = Omit<BatchPayload, 'events'> & { events: ServerEvent[] };

const collectUrl = () => process.env.BEACON_COLLECT_URL || BEACON_COLLECT_URL;

/** 받은 배치 본문을 수집 서버로 그대로 넘긴다. 봇 필터용으로 UA를 함께 보낸다. */
export const forwardBatch = (body: string, userAgent: string | null) =>
  fetch(collectUrl(), {
    method: 'POST',
    headers: userAgent ? { 'user-agent': userAgent } : undefined,
    body,
    cache: 'no-store',
  });

/** 서버에서 발생한 이벤트(슬랙 커맨드 등)를 수집 서버에 기록한다 */
export const trackServerEvent = async (
  name: string,
  props: Record<string, unknown> = {},
  path = '/'
): Promise<void> => {
  if (!isProd) return;

  const now = new Date().toISOString();
  const payload: ServerBatch = {
    sdk: { name: 'mega-bobs-server', version: '1' },
    sentAt: now,
    events: [
      {
        name,
        ts: now,
        siteId: BEACON_SITE_ID,
        url: new URL(path, SITE_URL).toString(),
        props,
      },
    ],
  };

  try {
    const res = await forwardBatch(JSON.stringify(payload), null);
    if (!res.ok) console.error('[beacon] server event rejected:', res.status);
  } catch (error) {
    // 수집 실패가 API 응답을 막으면 안 됨
    console.error('[beacon] server event failed:', error);
  }
};
