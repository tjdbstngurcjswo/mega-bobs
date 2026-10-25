import 'server-only';

import type { BatchPayload } from 'hongsoohyuk-beacon';

import { BEACON_COLLECT_URL, BEACON_SITE_ID } from '@/constants/beacon';
import { isProd, SITE_URL } from '@/utils/env';

type ServerEvent = Omit<
  BatchPayload['events'][number],
  'anonId' | 'sessionId' | 'referrer' | 'utm'
>;

type ServerBatch = Omit<BatchPayload, 'events'> & { events: ServerEvent[] };

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
    const res = await fetch(BEACON_COLLECT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!res.ok) console.error('[beacon] server event rejected:', res.status);
  } catch (error) {
    // 수집 실패가 API 응답을 막으면 안 됨
    console.error('[beacon] server event failed:', error);
  }
};
