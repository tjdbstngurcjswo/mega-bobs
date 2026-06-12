'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { getNextEmoji } from '@/constants/emojiAvatars';
import { DEFAULT_ITEMS, useLadderSession } from '@/hooks/useLadderSession';
import { type LadderData, buildLadder } from '@/utils/ladder';

import type { LadderPhase } from './LadderGame.types';

const ANIM_MS = 5500;
const MAX = 8;

const autoFillItems = (items: string[], targetLen: number): string[] => {
  if (items.length >= targetLen) return items;
  const result = [...items];
  while (result.length < targetLen) {
    result.push(DEFAULT_ITEMS[result.length] ?? '꽝');
  }
  return result;
};

const checkCanPlay = (participants: string[], items: string[]) =>
  participants.length >= 2 && items.length >= 2 && participants.length === items.length;

// eslint-disable-next-line max-lines-per-function
export const useLadderGame = () => {
  const { participants, items, setParticipants, setItems, loaded } =
    useLadderSession();
  const [phase, setPhase] = useState<LadderPhase>('input');
  const [seed, setSeed] = useState(0);
  const [playedData, setPlayedData] = useState<LadderData | null>(null);
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());
  const [animatingSet, setAnimatingSet] = useState<Set<number>>(new Set());
  const [borderReadySet, setBorderReadySet] = useState<Set<number>>(new Set());

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

  const canAddPerson = phase === 'input';

  const canPlay = checkCanPlay(participants, items);

  const ladderData = useMemo(
    () => (canPlay ? buildLadder(participants.length) : null),
    // Recalculate only on count change or retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [participants.length, items.length, seed]
  );

  const playAll = () => {
    if (!canPlay || !ladderData || phase !== 'input') return;
    const all = new Set(Array.from({ length: participants.length }, (_, i) => i));
    setPlayedData(ladderData);
    setRevealedSet(all);
    setAnimatingSet(all);
    setPhase('animating');
    setTimeout(() => {
      setPhase('result');
      setAnimatingSet(new Set());
      setBorderReadySet(all);
    }, ANIM_MS);
  };

  const playOne = (i: number) => {
    if (!canPlay || !ladderData || phase !== 'input') return;
    setPlayedData(ladderData);
    setPhase('result');
    setRevealedSet(new Set([i]));
    setAnimatingSet(new Set([i]));
    setTimeout(() => {
      setAnimatingSet((prev) => {
        const next = new Set(prev);
        next.delete(i);
        return next;
      });
      setBorderReadySet((prev) => new Set([...prev, i]));
    }, ANIM_MS);
  };

  const revealOne = (i: number) => {
    setAnimatingSet((prev) => new Set([...prev, i]));
    setRevealedSet((prev) => new Set([...prev, i]));
    setTimeout(() => {
      setAnimatingSet((prev) => {
        const next = new Set(prev);
        next.delete(i);
        return next;
      });
      setBorderReadySet((prev) => new Set([...prev, i]));
    }, ANIM_MS);
  };

  const revealAll = () => {
    const all = new Set(Array.from({ length: participants.length }, (_, i) => i));
    setRevealedSet(all);
    setBorderReadySet(all);
  };

  const retry = () => {
    setPhase('input');
    setSeed((s) => s + 1);
    setRevealedSet(new Set());
    setAnimatingSet(new Set());
    setBorderReadySet(new Set());
  };

  const onParticipantClick = (i: number) => {
    if (phase === 'input') playOne(i);
    else if (phase === 'result' && !revealedSet.has(i)) revealOne(i);
  };

  const allRevealed =
    phase === 'result' && revealedSet.size === participants.length;
  const ctaLabel =
    phase === 'animating'
      ? '확인 중…'
      : allRevealed
        ? '↺ 다시하기'
        : '한번에 결과 보기';
  const ctaDisabled = phase === 'animating' || (phase === 'input' && !canPlay);
  const onCta = allRevealed ? retry : phase === 'input' ? playAll : revealAll;
  const displayLadderData =
    phase === 'result' && playedData ? playedData : ladderData;

  return {
    participants,
    items,
    loaded,
    phase,
    seed,
    displayLadderData,
    canAddPerson,
    revealedSet,
    animatingSet,
    borderReadySet,
    ctaLabel,
    ctaDisabled,
    onCta,
    changeParticipants,
    addPerson,
    setItems,
    onParticipantClick,
  };
};
