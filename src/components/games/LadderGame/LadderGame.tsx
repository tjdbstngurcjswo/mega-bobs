'use client';

import { useMemo, useState } from 'react';

import { getNextEmoji } from '@/constants/emojiAvatars';
import { DEFAULT_ITEMS, useLadderSession } from '@/hooks/useLadderSession';
import { cn } from '@/utils/cn';
import { type LadderData, buildLadder } from '@/utils/ladder';

import { _LadderBoard } from './_LadderBoard';
import { ctaButtonClass, gameWrapClass } from './LadderGame.styles';
import type { LadderPhase } from './LadderGame.types';

const ANIM_MS = 2000;
const MAX = 8;

const autoFillItems = (items: string[], targetLen: number): string[] => {
  if (items.length >= targetLen) return items;
  const result = [...items];
  while (result.length < targetLen) {
    result.push(DEFAULT_ITEMS[result.length] ?? '꽝');
  }
  return result;
};


const useLadderGame = () => {
  const { participants, items, setParticipants, setItems, loaded } =
    useLadderSession();
  const [phase, setPhase] = useState<LadderPhase>('input');
  const [seed, setSeed] = useState(0);
  const [playedData, setPlayedData] = useState<LadderData | null>(null);
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  const changeParticipants = (next: string[]) => {
    setParticipants(next);
    if (next.length > items.length) setItems(autoFillItems(items, next.length));
  };

  const addPerson = () => {
    if (participants.length >= MAX || phase !== 'input') return;
    const nextP = [...participants, getNextEmoji(participants)];
    setParticipants(nextP);
    setItems(autoFillItems(items, nextP.length));
  };

  const canAddPerson = participants.length < MAX && phase === 'input';

  const canPlay =
    participants.length >= 2 &&
    items.length >= 2 &&
    participants.length === items.length;

  const ladderData = useMemo(
    () => (canPlay ? buildLadder(participants.length) : null),
    // Recalculate only on count change or retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [participants.length, items.length, seed]
  );

  const startGame = (revealed: Set<number>) => {
    if (!canPlay || !ladderData || phase !== 'input') return;
    setPlayedData(ladderData);
    setPhase('animating');
    setTimeout(() => { setPhase('result'); setRevealedSet(revealed); }, ANIM_MS);
  };

  const playAll = () =>
    startGame(new Set(Array.from({ length: participants.length }, (_, i) => i)));

  const playOne = (i: number) => startGame(new Set([i]));

  const revealOne = (i: number) =>
    setRevealedSet((prev) => new Set([...prev, i]));

  const revealAll = () =>
    setRevealedSet(new Set(Array.from({ length: participants.length }, (_, i) => i)));

  const retry = () => { setPhase('input'); setSeed((s) => s + 1); setRevealedSet(new Set()); };

  const onParticipantClick = (i: number) => {
    if (phase === 'input') playOne(i);
    else if (phase === 'result' && !revealedSet.has(i)) revealOne(i);
  };

  return { participants, items, loaded, phase, seed, ladderData, playedData, canPlay, canAddPerson, revealedSet, changeParticipants, addPerson, setItems, playAll, revealAll, retry, onParticipantClick };
};

const LadderGame = () => {
  const {
    participants, items, loaded, phase, seed, ladderData, playedData,
    canPlay, canAddPerson, revealedSet,
    changeParticipants, addPerson, setItems, playAll, revealAll, retry, onParticipantClick,
  } = useLadderGame();

  if (!loaded) return null;

  const allRevealed = phase === 'result' && revealedSet.size === participants.length;
  const ctaLabel = phase === 'animating' ? '확인 중…' : allRevealed ? '↺ 다시하기' : '한번에 결과 보기';
  const ctaDisabled = phase === 'animating' || (phase === 'input' && !canPlay);
  const onCta = allRevealed ? retry : phase === 'input' ? playAll : revealAll;

  return (
    <GameView
      participants={participants}
      items={items}
      phase={phase}
      seed={seed}
      ladderData={phase === 'result' && playedData ? playedData : ladderData}
      revealedSet={revealedSet}
      ctaLabel={ctaLabel}
      ctaDisabled={ctaDisabled}
      canAddPerson={canAddPerson}
      onParticipantsChange={changeParticipants}
      onItemsChange={setItems}
      onPlay={onCta}
      onAddPerson={addPerson}
      onParticipantClick={onParticipantClick}
    />
  );
};

interface GameViewProps {
  participants: string[];
  items: string[];
  phase: LadderPhase;
  seed: number;
  ladderData: LadderData | null;
  revealedSet: Set<number>;
  ctaLabel: string;
  ctaDisabled: boolean;
  canAddPerson: boolean;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onPlay: () => void;
  onAddPerson: () => void;
  onParticipantClick: (i: number) => void;
}

const GameView = ({
  participants, items, phase, seed, ladderData, revealedSet,
  ctaLabel, ctaDisabled, canAddPerson,
  onParticipantsChange, onItemsChange, onPlay, onAddPerson, onParticipantClick,
}: GameViewProps) => (
  <div className={gameWrapClass}>
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onAddPerson}
        disabled={!canAddPerson}
        className={cn(
          'text-[11px] cursor-pointer transition-opacity',
          canAddPerson ? 'text-muted hover:text-ink' : 'invisible'
        )}
        aria-label="인원 추가"
      >+ 인원 추가</button>
    </div>
    <_LadderBoard
      key={`board-${seed}`}
      participants={participants}
      items={items}
      data={ladderData}
      phase={phase}
      revealedSet={revealedSet}
      onParticipantsChange={onParticipantsChange}
      onItemsChange={onItemsChange}
      onParticipantClick={onParticipantClick}
    />

    <button
      type="button"
      className={ctaButtonClass(ctaDisabled)}
      onClick={onPlay}
      disabled={ctaDisabled}
      aria-disabled={ctaDisabled}
      aria-label="사다리 결과 확인"
    >{ctaLabel}</button>

  </div>
);

export default LadderGame;
