'use client';

import { useMemo, useState } from 'react';

import { getNextEmoji } from '@/constants/emojiAvatars';
import { DEFAULT_ITEMS, useLadderSession } from '@/hooks/useLadderSession';
import { type LadderData, buildLadder } from '@/utils/ladder';

import { _LadderBoard } from './_LadderBoard';
import { addPersonButtonClass, ctaButtonClass, gameWrapClass } from './LadderGame.styles';
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

const getHint = (loaded: boolean, canPlay: boolean, phase: LadderPhase, pLen: number) => {
  if (!loaded || canPlay || phase !== 'input') return null;
  if (pLen < 2) return '참여자를 2명 이상 입력하세요';
  return `참여자(${pLen})와 항목 수를 맞춰주세요`;
};

const useLadderGame = () => {
  const { participants, items, setParticipants, setItems, loaded } =
    useLadderSession();
  const [phase, setPhase] = useState<LadderPhase>('input');
  const [seed, setSeed] = useState(0);
  const [playedData, setPlayedData] = useState<LadderData | null>(null);

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

  const play = () => {
    if (!canPlay || !ladderData || phase !== 'input') return;
    setPlayedData(ladderData);
    setPhase('animating');
    setTimeout(() => setPhase('result'), ANIM_MS);
  };

  const retry = () => { setPhase('input'); setSeed((s) => s + 1); };

  return { participants, items, loaded, phase, seed, ladderData, playedData, canPlay, canAddPerson, changeParticipants, addPerson, setItems, play, retry };
};

const LadderGame = () => {
  const { participants, items, loaded, phase, seed, ladderData, playedData, canPlay, canAddPerson, changeParticipants, addPerson, setItems, play, retry } = useLadderGame();

  if (!loaded) return null;

  const hint = getHint(loaded, canPlay, phase, participants.length);
  const isDone = phase === 'result';
  const ctaLabel = phase === 'animating' ? '확인 중…' : isDone ? '↺ 다시하기' : '결과 확인 →';
  const ctaDisabled = isDone ? false : !canPlay || phase === 'animating';

  return (
    <GameView
      participants={participants}
      items={items}
      phase={phase}
      seed={seed}
      ladderData={isDone && playedData ? playedData : ladderData}
      playedData={isDone ? playedData : null}
      hint={hint}
      ctaLabel={ctaLabel}
      ctaDisabled={ctaDisabled}
      canAddPerson={canAddPerson}
      onParticipantsChange={changeParticipants}
      onItemsChange={setItems}
      onPlay={isDone ? retry : play}
      onAddPerson={addPerson}
    />
  );
};

interface GameViewProps {
  participants: string[];
  items: string[];
  phase: LadderPhase;
  seed: number;
  ladderData: LadderData | null;
  playedData: LadderData | null;
  hint: string | null;
  ctaLabel: string;
  ctaDisabled: boolean;
  canAddPerson: boolean;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onPlay: () => void;
  onAddPerson: () => void;
}

const InlineResult = ({ participants, items, data }: { participants: string[]; items: string[]; data: LadderData }) => {
  const winnerItem = items[0];
  return (
    <div className="flex flex-col gap-1 animate-[fadeIn_0.3s_ease_both]">
      {participants.map((name, i) => {
        const item = items[data.results[i]];
        const isWinner = item === winnerItem && participants.length > 1;
        return (
          <div key={i} className={`flex items-center gap-2.5 px-4 py-2.5 ${isWinner ? 'bg-board' : 'bg-surface'}`}>
            <span className="font-emoji text-lg leading-none select-none">{name}</span>
            <span className={`text-[11px] ${isWinner ? 'text-cream-2' : 'text-muted'}`}>→</span>
            <span className={`text-[13px] font-bold ${isWinner ? 'text-accent font-extrabold' : 'text-ink'}`}>{item}</span>
          </div>
        );
      })}
    </div>
  );
};

const GameView = ({
  participants, items, phase, seed, ladderData, playedData, hint,
  ctaLabel, ctaDisabled, canAddPerson,
  onParticipantsChange, onItemsChange, onPlay, onAddPerson,
}: GameViewProps) => (
  <div className={gameWrapClass}>
    <_LadderBoard
      key={`board-${seed}`}
      participants={participants}
      items={items}
      data={ladderData}
      phase={phase}
      canAddPerson={canAddPerson}
      onParticipantsChange={onParticipantsChange}
      onItemsChange={onItemsChange}
      onAddPerson={onAddPerson}
    />

    {playedData && (
      <InlineResult participants={participants} items={items} data={playedData} />
    )}

    <button
      type="button"
      className={ctaButtonClass(ctaDisabled)}
      onClick={onPlay}
      disabled={ctaDisabled}
      aria-disabled={ctaDisabled}
      aria-label="사다리 결과 확인"
    >{ctaLabel}</button>

    {hint && <p className="text-center text-[12px] text-muted">{hint}</p>}
  </div>
);

export default LadderGame;
