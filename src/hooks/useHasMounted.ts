'use client';

import {useLayoutEffect, useState} from 'react';

/**
 * 클라이언트 마운트 여부.
 * useLayoutEffect — 브라우저 페인트 전에 동기 실행되므로
 * mounted=false 상태가 화면에 노출되지 않아 레이아웃 shift가 없다.
 */
export const useHasMounted = () => {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  return mounted;
};
