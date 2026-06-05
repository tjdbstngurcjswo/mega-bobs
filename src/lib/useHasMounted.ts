'use client';

import {useEffect, useState} from 'react';

/**
 * 클라이언트 마운트 여부.
 * ISR 정적 HTML(생성 시점 '오늘')과 클라이언트의 실제 '오늘'이 어긋날 수 있는
 * 날짜 의존 UI를 마운트 후에만 확정해 하이드레이션 불일치/점프를 막는다.
 */
export const useHasMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};
