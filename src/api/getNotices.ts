import { NOTICES } from '@/data/notices';
import dayjs from '@/lib/dayjs';
import type { Notice, NoticeEnv } from '@/models/notice';

const NODE_ENV_MAP: Record<string, NoticeEnv> = {
  development: 'dev',
  production: 'prod',
};

export const getNotices = (): Notice[] => {
  const now = dayjs();
  const env: NoticeEnv = NODE_ENV_MAP[process.env.NODE_ENV ?? ''] ?? 'prod';
  return NOTICES.filter(
    (n) => n.env.includes(env) && !dayjs(n.publishedAt).isAfter(now)
  );
};

export const getNoticeById = (id: string): Notice | undefined =>
  getNotices().find((n) => n.id === id);
