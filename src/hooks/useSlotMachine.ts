import { useEffect, useRef, useState } from 'react';

import {
  MAX_NAMES,
  MIN_NAMES,
  SPIN_PHASES,
} from '@/components/games/SlotMachine/SlotMachine.constants';

export const useSlotMachine = () => {
  const [names, setNames] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinRef = useRef<() => void>(() => undefined);

  const spin = () => {
    if (isSpinning || names.length < MIN_NAMES) return;
    setIsSpinning(true);
    setWinner(null);

    const picked = names[Math.floor(Math.random() * names.length)];

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayName(picked);
      setWinner(picked);
      setIsSpinning(false);
      return;
    }

    let phaseIdx = 0;
    const runPhase = () => {
      if (phaseIdx >= SPIN_PHASES.length) {
        setDisplayName(picked);
        setWinner(picked);
        setIsSpinning(false);
        return;
      }
      const { interval, duration } = SPIN_PHASES[phaseIdx];
      const start = Date.now();
      const tick = () => {
        setDisplayName(names[Math.floor(Math.random() * names.length)]);
        if (Date.now() - start < duration) {
          timerRef.current = setTimeout(tick, interval);
        } else {
          phaseIdx++;
          runPhase();
        }
      };
      tick();
    };
    runPhase();
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

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsSpinning(false);
    setWinner(null);
    setDisplayName('');
  };

  return {
    names,
    input,
    setInput,
    isSpinning,
    winner,
    isDuplicate,
    canSpin: names.length >= MIN_NAMES && !isSpinning,
    statusLabel: isSpinning ? 'SPINNING…' : winner ? 'DONE' : 'READY',
    shownName: displayName || (names.length > 0 ? '?' : '—'),
    addName,
    removeName,
    spin,
    reset,
  };
};
