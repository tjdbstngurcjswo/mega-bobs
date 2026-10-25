import { BEACON_SITE_ID } from '@/constants/beacon';

/** 프록시가 다른 siteId 이벤트를 대신 실어 나르지 않도록 메가밥스 배치만 통과시킨다 */
const isOwnBatch = (body: string): boolean => {
  try {
    const parsed: unknown = JSON.parse(body);
    const events = (parsed as { events?: unknown })?.events;
    if (!Array.isArray(events) || events.length === 0) return false;
    return events.every(
      (ev) => (ev as { siteId?: unknown })?.siteId === BEACON_SITE_ID
    );
  } catch {
    return false;
  }
};

export default isOwnBatch;
