'use client';

import { useLayoutEffect, useRef } from 'react';

export const useAnimatedHeight = <T extends HTMLElement>(
  dependency: unknown
) => {
  const ref = useRef<T>(null);
  const prevHeightRef = useRef(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const next = el.scrollHeight;
    const prev = prevHeightRef.current;
    prevHeightRef.current = next;
    if (!prev || prev === next) return;
    const animation = el.animate(
      [{ height: `${prev}px` }, { height: `${next}px` }],
      {
        duration: 280,
        easing: 'ease-in-out',
      }
    );
    return () => animation.cancel();
  }, [dependency]);

  return ref;
};
