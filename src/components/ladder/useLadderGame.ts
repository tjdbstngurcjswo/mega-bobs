'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { getNextEmoji } from '@/constants/emojiAvatars';
import { DEFAULT_ITEMS, useLadderSession } from '@/hooks/useLadderSession';
import { type LadderData, buildLadder } from '@/utils/ladder';

import type { LadderPhase, RevealState } from './LadderGame.types';

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

const checkCanPlay = (participants: string[], items: string[]) =>
  participants.length >= 2 &&
  items.length >= 2 &&
  participants.length === items.length;

// eslint-disable-next-line max-lines-per-function
export const useLadderGame = () => {
  const { participants, items, setParticipants, setItems, loaded } =
    useLadderSession();
  const [phase, setPhase] = useState<LadderPhase>('input');
  const [seed, setSeed] = useState(0);
  const [playedData, setPlayedData] = useState<LadderData | null>(null);
  const [reveal, setReveal] = useState(EMPTY_REVEAL);

  const borderReady = new Set(
    [...reveal.revealed].filter((i) => !reveal.animating.has(i))
  );
  const revealState: RevealState = { ...reveal, borderReady };

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
    const all = new Set(
      Array.from({ length: participants.length }, (_, i) => i)
    );
    setPlayedData(ladderData);
    setReveal({ revealed: all, animating: all });
    setPhase('animating');
    setTimeout(() => {
      setPhase('result');
      setReveal({ revealed: all, animating: new Set() });
    }, ANIM_MS);
  };

  const playOne = (i: number) => {
    if (!canPlay || !ladderData || phase !== 'input') return;
    setPlayedData(ladderData);
    setPhase('result');
    setReveal({ revealed: new Set([i]), animating: new Set([i]) });
    setTimeout(() => {
      setReveal((prev) => ({
        revealed: prev.revealed,
        animating: new Set([...prev.animating].filter((x) => x !== i)),
      }));
    }, ANIM_MS);
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

  const onParticipantClick = (i: number) => {
    if (phase === 'input') playOne(i);
    else if (phase === 'result' && !reveal.revealed.has(i)) revealOne(i);
  };

  const shuffleParticipants = () => {
    if (phase !== 'input') return;
    setParticipants([...participants].sort(() => Math.random() - 0.5));
  };

  const allRevealed =
    phase === 'result' && reveal.revealed.size === participants.length;
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
    reveal: revealState,
    ctaLabel,
    ctaDisabled,
    onCta,
    changeParticipants,
    addPerson,
    shuffleParticipants,
    setItems,
    onParticipantClick,
  };
};
