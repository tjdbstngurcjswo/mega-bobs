import { useEffect, useRef, useState } from 'react';

import {
  MAX_NAMES,
  MIN_NAMES,
  REEL_ITEM_H,
  REEL_SPIN_DURATION,
} from '@/components/games/SlotMachine/SlotMachine.constants';

// eslint-disable-next-line max-lines-per-function
export const useSlotMachine = () => {
  const [names, setNames] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const rafRef = useRef<number | null>(null);
  const spinRef = useRef<() => void>(() => undefined);

  const cancelAnimation = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const spin = () => {
    if (isSpinning || names.length < MIN_NAMES) return;

    const picked = names[Math.floor(Math.random() * names.length)];
    const pickedIdx = names.indexOf(picked);

    setIsSpinning(true);
    setWinner(null);

    const totalH = names.length * REEL_ITEM_H;
    const startPos = scrollPos;
    const currentOffset = startPos % totalH;
    const winnerOffset = pickedIdx * REEL_ITEM_H;
    const distToWinner = ((winnerOffset - currentOffset) + totalH) % totalH;
    // 6 full rotations + land on winner
    const targetPos = startPos + 6 * totalH + distToWinner;

    let startTime: number | null = null;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / REEL_SPIN_DURATION, 1);
      // quintic ease-out: explosive start → dramatic deceleration → stop
      const eased = 1 - Math.pow(1 - t, 5);
      setScrollPos(startPos + (targetPos - startPos) * eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // normalize to avoid floating-point drift
        const normalized = ((targetPos % totalH) + totalH) % totalH;
        setScrollPos(normalized);
        setWinner(picked);
        setIsSpinning(false);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
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

  useEffect(() => () => cancelAnimation(), []);

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

  return {
    names,
    input,
    setInput,
    isSpinning,
    winner,
    isDuplicate,
    scrollPos,
    canSpin: names.length >= MIN_NAMES && !isSpinning,
    addName,
    removeName,
    spin,
  };
};
