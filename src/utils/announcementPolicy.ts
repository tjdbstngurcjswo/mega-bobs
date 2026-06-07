import dayjs from '@/lib/dayjs';
import type { Notice } from '@/models/notice';

export const hasNewAnnouncement = (announcements: Notice[]): boolean =>
  announcements.some(
    (n) => dayjs().tz().diff(dayjs.tz(n.publishedAt), 'day') < 7
  );
