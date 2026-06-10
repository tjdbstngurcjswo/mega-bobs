'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

import { getNextAvatarKey } from '@/constants/iconAvatars';
import { DEFAULT_ITEMS, useLadderSession } from '@/hooks/useLadderSession';
import { type LadderData, buildLadder } from '@/utils/ladder';

import { _LadderBoard } from './_LadderBoard';
import { _LadderResult } from './_LadderResult';
import { addPersonButtonClass, ctaButtonClass, gameWrapClass } from './LadderGame.styles';
import type { LadderPhase } from './LadderGame.types';

const ANIM_MS = 2000;
const MAX = 8;

const autoFillItems = (items: string[], targetLen: number): string[] => {
  if (items.length >= targetLen) return items;
  const result = [...items];
  while (result.length < targetLen) {
    const idx = result.length;
    const def = DEFAULT_ITEMS[idx] ?? `항목 ${idx + 1}`;
    result.push(result.includes(def) ? `항목 ${idx + 1}` : def);
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
    const nextP = [...participants, getNextAvatarKey(participants)];
    setParticipants(nextP);
    setItems(autoFillItems(items, nextP.length));
  };

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

  return { participants, items, loaded, phase, seed, ladderData, playedData, canPlay, changeParticipants, addPerson, setItems, play, retry };
};

const LadderGame = () => {
  const { participants, items, loaded, phase, seed, ladderData, playedData, canPlay, changeParticipants, addPerson, setItems, play, retry } = useLadderGame();

  if (!loaded) return null;

  const hint = getHint(loaded, canPlay, phase, participants.length);
  const ctaLabel = phase === 'animating' ? '확인 중…' : '결과 확인 →';
  const canAddPerson = participants.length < MAX && phase === 'input';

  return (
    <AnimatePresence mode="wait">
      {phase !== 'result' ? (
        <GameView
          participants={participants}
          items={items}
          phase={phase}
          seed={seed}
          ladderData={ladderData}
          hint={hint}
          ctaLabel={ctaLabel}
          ctaDisabled={!canPlay || phase === 'animating'}
          canAddPerson={canAddPerson}
          onParticipantsChange={changeParticipants}
          onItemsChange={setItems}
          onPlay={play}
          onAddPerson={addPerson}
        />
      ) : playedData ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <_LadderResult
            participants={participants}
            items={items}
            data={playedData}
            onRetry={retry}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

interface GameViewProps {
  participants: string[];
  items: string[];
  phase: LadderPhase;
  seed: number;
  ladderData: LadderData | null;
  hint: string | null;
  ctaLabel: string;
  ctaDisabled: boolean;
  canAddPerson: boolean;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onPlay: () => void;
  onAddPerson: () => void;
}

const GameView = ({
  participants, items, phase, seed, ladderData, hint,
  ctaLabel, ctaDisabled, canAddPerson,
  onParticipantsChange, onItemsChange, onPlay, onAddPerson,
}: GameViewProps) => (
  <motion.div
    key="game"
    className={gameWrapClass}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.18 }}
  >
    <_LadderBoard
      key={`board-${seed}`}
      participants={participants}
      items={items}
      data={ladderData}
      phase={phase}
      onParticipantsChange={onParticipantsChange}
      onItemsChange={onItemsChange}
    />

    <div className="flex gap-2">
      {canAddPerson && (
        <button
          type="button"
          className={addPersonButtonClass(false)}
          onClick={onAddPerson}
          aria-label="인원 추가"
        >+ 인원 추가</button>
      )}
      <button
        type="button"
        className={ctaButtonClass(ctaDisabled)}
        onClick={onPlay}
        disabled={ctaDisabled}
        aria-disabled={ctaDisabled}
        aria-label="사다리 결과 확인"
      >{ctaLabel}</button>
    </div>

    {hint && <p className="text-center text-[12px] text-muted">{hint}</p>}
  </motion.div>
);

export default LadderGame;
