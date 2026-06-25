'use client';

import { useEffect, useState } from 'react';

import { getReadNoticeIds } from '@/utils/noticePolicy';

import { newBadgeClass } from './NoticeNewBadge.styles';

const NoticeNewBadge = ({
  noticeId,
  isNew,
}: {
  noticeId: string;
  isNew: boolean;
}) => {
  const [read, setRead] = useState<boolean | null>(null);

  useEffect(() => {
    setRead(getReadNoticeIds().includes(noticeId));
  }, [noticeId]);

  if (!isNew || read !== false) return null;
  return <span className={newBadgeClass}>NEW</span>;
};

export default NoticeNewBadge;
