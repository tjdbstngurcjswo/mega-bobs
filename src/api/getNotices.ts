import { NOTICES } from '@/data/notices';
import type { Notice } from '@/models/notice';

export const getNotices = (): Notice[] => NOTICES;

export const getNoticeById = (id: string): Notice | undefined =>
  NOTICES.find((n) => n.id === id);
