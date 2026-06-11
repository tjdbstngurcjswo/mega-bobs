import { useEffect, useRef, useState } from 'react';

import {
  MAX_NAMES,
  MIN_NAMES,
  REEL_SPIN_DURATION,
  SPIN_FAST_INTERVAL,
} from '@/components/games/SlotMachine/SlotMachine.constants';

const getReelItems = (
  names: string[],
  idx: number
): [string, string, string] => {
  if (names.length === 0) return ['—', '—', '—'];
  const len = names.length;
  return [
    names[(idx - 1 + len) % len],
    names[idx % len],
    names[(idx + 1) % len],
  ];
};

// eslint-disable-next-line max-lines-per-function
export const useSlotMachine = () => {
  const [names, setNames] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelIdx, setReelIdx] = useState(0);
  const [reelStopped, setReelStopped] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinRef = useRef<() => void>(() => undefined);

  const clearAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const spin = () => {
    if (isSpinning || names.length < MIN_NAMES) return;
    setIsSpinning(true);
    setWinner(null);
    setReelStopped(false);

    const picked = names[Math.floor(Math.random() * names.length)];
    const pickedIdx = names.indexOf(picked);

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setReelIdx(pickedIdx);
      setReelStopped(true);
      setWinner(picked);
      setIsSpinning(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setReelIdx(Math.floor(Math.random() * names.length));
    }, SPIN_FAST_INTERVAL);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setReelIdx(pickedIdx);
      setReelStopped(true);
      setWinner(picked);
      setIsSpinning(false);
    }, REEL_SPIN_DURATION);
  };

  // latest-ref pattern — avoids stale closure in keydown listener
  useEffect(() => {
    spinRef.current = spin;
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        spinRef.current();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => () => clearAll(), []);

  const addName = () => {
    const trimmed = input.trim();
    if (!trimmed || isSpinning || names.length >= MAX_NAMES) return;
    if (names.includes(trimmed)) {
      setIsDuplicate(true);
      setTimeout(() => setIsDuplicate(false), 400);
      return;
    }
    setNames((prev) => [...prev, trimmed]);
    setInput('');
    if (winner) setWinner(null);
  };

  const removeName = (name: string) => {
    if (isSpinning) return;
    setNames((prev) => prev.filter((n) => n !== name));
    if (winner === name) setWinner(null);
  };

  const reset = () => {
    clearAll();
    setIsSpinning(false);
    setWinner(null);
    setReelStopped(true);
  };

  return {
    names,
    input,
    setInput,
    isSpinning,
    winner,
    isDuplicate,
    reel: {
      items: getReelItems(names, reelIdx),
      stopped: reelStopped,
    },
    canSpin: names.length >= MIN_NAMES && !isSpinning,
    addName,
    removeName,
    spin,
    reset,
  };
};
