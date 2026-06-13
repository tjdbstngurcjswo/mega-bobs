'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { getNextEmoji } from '@/constants/emojiAvatars';
import { DEFAULT_ITEMS, useLadderSession } from '@/hooks/useLadderSession';
import { type LadderData, buildLadder } from '@/utils/ladder';

import type { LadderPhase } from './LadderGame.types';

const ANIM_MS = 5500;
const MAX = 8;

const EMPTY_REVEAL = {
  revealed: new Set<number>(),
  animating: new Set<number>(),
};

const autoFillItems = (items: string[], targetLen: number): string[] => {
  if (items.length >= targetLen) return items;
  const result = [...items];
  while (result.length < targetLen) {
    result.push(DEFAULT_ITEMS[result.length] ?? '꽝');
  }
  return result;
};

export const useLadderGame = () => {
  const { participants, items, setParticipants, setItems, loaded } =
    useLadderSession();
  const [phase, setPhase] = useState<LadderPhase>('input');
  const [seed, setSeed] = useState(0);
  const [playedData, setPlayedData] = useState<LadderData | null>(null);
  const [reveal, setReveal] = useState(EMPTY_REVEAL);

  const changeParticipants = (next: string[]) => {
    setParticipants(next);
    if (next.length > items.length) setItems(autoFillItems(items, next.length));
  };

  const addPerson = () => {
    if (phase !== 'input') return;
    if (participants.length >= MAX) {
      toast(`최대 ${MAX}명까지 참여할 수 있어요`, { icon: '🚫' });
      return;
    }
    const nextP = [...participants, getNextEmoji(participants)];
    setParticipants(nextP);
    setItems(autoFillItems(items, nextP.length));
  };

  const builtLadder = useMemo(
    () =>
      participants.length >= 2 && items.length === participants.length
        ? buildLadder(participants.length)
        : null,
    // Recalculate only on count change or retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [participants.length, items.length, seed]
  );

  const ladderData =
    phase === 'result' && playedData ? playedData : builtLadder;

  const play = (index?: number) => {
    if (!builtLadder || phase !== 'input') return;
    setPlayedData(builtLadder);

    if (index === undefined) {
      const all = new Set(
        Array.from({ length: participants.length }, (_, i) => i)
      );
      setReveal({ revealed: all, animating: all });
      setPhase('animating');
      setTimeout(() => {
        setPhase('result');
        setReveal({ revealed: all, animating: new Set() });
      }, ANIM_MS);
    } else {
      setPhase('result');
      setReveal({
        revealed: new Set([index]),
        animating: new Set([index]),
      });
      setTimeout(() => {
        setReveal((prev) => ({
          revealed: prev.revealed,
          animating: new Set([...prev.animating].filter((x) => x !== index)),
        }));
      }, ANIM_MS);
    }
  };

  const revealOne = (i: number) => {
    setReveal((prev) => ({
      revealed: new Set([...prev.revealed, i]),
      animating: new Set([...prev.animating, i]),
    }));
    setTimeout(() => {
      setReveal((prev) => ({
        revealed: prev.revealed,
        animating: new Set([...prev.animating].filter((x) => x !== i)),
      }));
    }, ANIM_MS);
  };

  const revealAll = () => {
    const all = new Set(
      Array.from({ length: participants.length }, (_, i) => i)
    );
    const unrevealedArr = [...all].filter((i) => !reveal.revealed.has(i));
    if (unrevealedArr.length === 0) {
      setReveal({ revealed: all, animating: reveal.animating });
      return;
    }
    setReveal((prev) => ({
      revealed: all,
      animating: new Set([...prev.animating, ...unrevealedArr]),
    }));
    setTimeout(() => {
      setReveal((prev) => ({
        revealed: all,
        animating: new Set(
          [...prev.animating].filter((i) => !unrevealedArr.includes(i))
        ),
      }));
    }, ANIM_MS);
  };

  const retry = () => {
    setPhase('input');
    setSeed((s) => s + 1);
    setReveal(EMPTY_REVEAL);
  };

  const shuffleParticipants = () => {
    if (phase !== 'input') return;
    setParticipants([...participants].sort(() => Math.random() - 0.5));
  };

  return {
    participants,
    items,
    loaded,
    phase,
    seed,
    ladderData,
    revealed: reveal.revealed,
    animating: reveal.animating,
    play,
    revealOne,
    revealAll,
    retry,
    addPerson,
    changeParticipants,
    setItems,
    shuffleParticipants,
  };
};
