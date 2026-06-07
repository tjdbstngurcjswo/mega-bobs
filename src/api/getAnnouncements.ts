import {ANNOUNCEMENTS} from '@/data/announcements';
import dayjs from '@/lib/dayjs';
import type {Notice} from '@/types/notice';

export const getAnnouncements = (): Notice[] => {
  const now = dayjs();
  const env = process.env.NODE_ENV as 'development' | 'production';
  return ANNOUNCEMENTS.filter(
    (n) => n.env.includes(env) && !dayjs(n.publishedAt).isAfter(now),
  );
};

export const hasNewAnnouncement = (announcements: Notice[]): boolean =>
  announcements.some(
    (n) => dayjs().tz().diff(dayjs.tz(n.publishedAt), 'day') < 7,
  );
