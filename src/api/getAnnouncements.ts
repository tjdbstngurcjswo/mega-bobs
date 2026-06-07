import { ANNOUNCEMENTS } from '@/data/announcements';
import dayjs from '@/lib/dayjs';
import type { Notice } from '@/models/notice';

/**
 * 현재 환경(NODE_ENV)과 공개 시각 기준으로 유효한 공지 목록을 반환한다.
 */
export const getAnnouncements = (): Notice[] => {
  const now = dayjs();
  const env = process.env.NODE_ENV as 'development' | 'production';
  return ANNOUNCEMENTS.filter(
    (n) => n.env.includes(env) && !dayjs(n.publishedAt).isAfter(now)
  );
};
