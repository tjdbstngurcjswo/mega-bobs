import dayjs from '@/lib/dayjs';
import type { Notice } from '@/models/notice';

const NOTICE_READ_KEY = 'notice-read';
const NEW_NOTICE_THRESHOLD_DAYS = 7;

export const getReadNoticeIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(NOTICE_READ_KEY) ?? '[]'
    );
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
};

export const NOTICE_READ_EVENT = 'notice-read';

export const markNoticeRead = (id: string): void => {
  if (typeof window === 'undefined') return;
  const ids = getReadNoticeIds();
  if (!ids.includes(id)) {
    localStorage.setItem(NOTICE_READ_KEY, JSON.stringify([...ids, id]));
    window.dispatchEvent(new Event(NOTICE_READ_EVENT));
  }
};

export const hasNewNotice = (
  notices: Notice[],
  readIds: string[] = []
): boolean => {
  if (notices.length === 0) return false;
  const top = notices[0];
  if (readIds.includes(top.id)) return false;
  return (
    dayjs().tz().diff(dayjs.tz(top.publishedAt), 'day') <
    NEW_NOTICE_THRESHOLD_DAYS
  );
};
