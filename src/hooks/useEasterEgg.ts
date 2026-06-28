import { useCallback, useEffect, useRef, useState } from 'react';

export type EggStep = 0 | 1 | 2;

const THRESHOLD = 5;
const TIMEOUT_MS = 3000;
const TRIGGERED_DURATION_MS = 3000;

export const calcEggStep = (clickCount: number): EggStep => {
  if (clickCount >= 4) return 2;
  if (clickCount >= 3) return 1;
  return 0;
};

export const useEasterEgg = () => {
  const [clickCount, setClickCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = calcEggStep(clickCount);

  const handleLabelClick = useCallback(() => {
    if (triggered) return;

    const next = clickCountRef.current + 1;

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    if (next >= THRESHOLD) {
      clickCountRef.current = 0;
      setTriggered(true);
      setClickCount(0);
      return;
    }

    clickCountRef.current = next;
    setClickCount(next);
    resetTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      setClickCount(0);
    }, TIMEOUT_MS);
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    const id = setTimeout(() => setTriggered(false), TRIGGERED_DURATION_MS);
    return () => clearTimeout(id);
  }, [triggered]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return { step, triggered, handleLabelClick };
};
