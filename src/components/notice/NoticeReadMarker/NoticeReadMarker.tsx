'use client';

import { useEffect } from 'react';

import { markNoticeRead } from '@/utils/noticePolicy';

const NoticeReadMarker = ({ id }: { id: string }) => {
  useEffect(() => {
    markNoticeRead(id);
  }, [id]);

  return null;
};

export default NoticeReadMarker;
