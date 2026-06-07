import dayjs from '@/lib/dayjs';
import type { Notice } from '@/models/notice';

const NEW_ANNOUNCEMENT_THRESHOLD_DAYS = 7;

export const hasNewAnnouncement = (announcements: Notice[]): boolean =>
  announcements.some(
    (n) =>
      dayjs().tz().diff(dayjs.tz(n.publishedAt), 'day') <
      NEW_ANNOUNCEMENT_THRESHOLD_DAYS
  );
