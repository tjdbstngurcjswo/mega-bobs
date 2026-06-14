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
  const { participants, items, setParticipants, setItems } = useLadderSession();
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
    participants, // 참가자 이모지 배열
    items, // 결과 항목 배열
    phase, // 게임 단계 — 'input' | 'animating' | 'result'
    seed, // retry 시 증가하는 카운터 → LadderBoard key로 써서 사다리 재생성 트리거
    ladderData, // 렌더에 쓸 사다리 구조 (result 단계면 확정된 playedData, 나머지는 미리보기)
    revealed: reveal.revealed, // 결과가 공개된 참가자 인덱스 Set
    animating: reveal.animating, // 경로 드로잉 애니메이션이 진행 중인 인덱스 Set
    play, // 게임 시작 — index 없으면 전체 공개, 있으면 해당 참가자만
    revealOne, // 특정 참가자 한 명의 결과를 추가 공개
    revealAll, // 미공개 참가자를 한 번에 전체 공개
    retry, // 입력 단계로 초기화 + 새 사다리 생성
    addPerson, // 참가자 한 명 추가 (최대 8명, 항목 자동 채움 포함)
    changeParticipants, // 참가자 배열 교체 (증가 시 항목도 자동 보충)
    setItems, // 항목 배열 직접 교체
    shuffleParticipants, // 참가자 순서 랜덤 섞기
  };
};
