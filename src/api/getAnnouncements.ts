import { ANNOUNCEMENTS } from '@/data/announcements';
import dayjs from '@/lib/dayjs';
import type { Notice, NoticeEnv } from '@/models/notice';

const NODE_ENV_MAP: Record<string, NoticeEnv> = {
  development: 'dev',
  production: 'prod',
};

/**
 * 현재 환경(NODE_ENV)과 공개 시각 기준으로 유효한 공지 목록을 반환한다.
 */
export const getAnnouncements = (): Notice[] => {
  const now = dayjs();
  const env: NoticeEnv = NODE_ENV_MAP[process.env.NODE_ENV ?? ''] ?? 'prod';
  return ANNOUNCEMENTS.filter(
    (n) => n.env.includes(env) && !dayjs(n.publishedAt).isAfter(now)
  );
};

export const getAnnouncementById = (id: string): Notice | undefined =>
  getAnnouncements().find((n) => n.id === id);
