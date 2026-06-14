import dayjs from '@/lib/dayjs';
import type { Notice } from '@/models/notice';

const NEW_NOTICE_THRESHOLD_DAYS = 7;

export const hasNewNotice = (notices: Notice[]): boolean =>
  notices.some(
    (n) =>
      dayjs().tz().diff(dayjs.tz(n.publishedAt), 'day') <
      NEW_NOTICE_THRESHOLD_DAYS
  );
