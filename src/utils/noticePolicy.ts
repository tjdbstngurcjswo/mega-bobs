import type { Notice } from '@/models/notice';

const NOTICE_READ_KEY = 'notice-read';

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
): boolean => notices.length > 0 && !readIds.includes(notices[0].id);
