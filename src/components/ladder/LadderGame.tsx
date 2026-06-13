'use client';

import { Shuffle } from 'lucide-react';
import type { ReactNode } from 'react';

import { GameWindow, useGameWindow } from '@/components/@shared';
import { cn } from '@/utils/cn';

import { _LadderBoard } from './_LadderBoard';
import { ctaButtonClass, gameWrapClass } from './LadderGame.styles';
import { useLadderGame } from './useLadderGame';

interface LadderContentProps {
  seed: number;
  participants: string[];
  items: string[];
  phase: ReturnType<typeof useLadderGame>['phase'];
  ladderData: ReturnType<typeof useLadderGame>['displayLadderData'];
  revealedSet: Set<number>;
  animatingSet: Set<number>;
  borderReadySet: Set<number>;
  ctaLabel: string;
  ctaDisabled: boolean;
  onCta: () => void;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onParticipantClick: (i: number) => void;
}

const LadderContent = ({
  seed,
  participants,
  items,
  phase,
  ladderData,
  revealedSet,
  animatingSet,
  borderReadySet,
  ctaLabel,
  ctaDisabled,
  onCta,
  onParticipantsChange,
  onItemsChange,
  onParticipantClick,
}: LadderContentProps): ReactNode => {
  const { isFullView } = useGameWindow();
  return (
    <div
      className={cn(
        gameWrapClass,
        isFullView && 'mx-auto w-full max-w-xl flex-1 overflow-y-auto'
      )}
      style={{ padding: '16px' }}
    >
      <_LadderBoard
        key={`board-${seed}`}
        participants={participants}
        items={items}
        data={ladderData}
        phase={phase}
        revealedSet={revealedSet}
        animatingSet={animatingSet}
        borderReadySet={borderReadySet}
        onParticipantsChange={onParticipantsChange}
        onItemsChange={onItemsChange}
        onParticipantClick={onParticipantClick}
      />
      <button
        type="button"
        className={ctaButtonClass(ctaDisabled)}
        onClick={onCta}
        disabled={ctaDisabled}
        aria-disabled={ctaDisabled}
        aria-label="사다리 결과 확인"
      >
        {ctaLabel}
      </button>
    </div>
  );
};

const LadderGame = () => {
  const {
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
    shuffleParticipants,
    setItems,
    onParticipantClick,
  } = useLadderGame();

  if (!loaded) return null;

  return (
    <GameWindow
      toolbar={
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={shuffleParticipants}
            className="text-muted hover:text-ink flex cursor-pointer items-center gap-1 px-2 py-0.5 text-[11px] transition-colors"
            aria-label="참가자 셔플"
          >
            <Shuffle size={10} />
            셔플
          </button>
          {canAddPerson && (
            <button
              type="button"
              onClick={addPerson}
              className="text-muted hover:text-ink cursor-pointer px-2 py-0.5 text-[11px] transition-colors"
              aria-label="인원 추가"
            >
              + 인원 추가
            </button>
          )}
        </div>
      }
    >
      <LadderContent
        seed={seed}
        participants={participants}
        items={items}
        phase={phase}
        ladderData={displayLadderData}
        revealedSet={revealedSet}
        animatingSet={animatingSet}
        borderReadySet={borderReadySet}
        ctaLabel={ctaLabel}
        ctaDisabled={ctaDisabled}
        onCta={onCta}
        onParticipantsChange={changeParticipants}
        onItemsChange={setItems}
        onParticipantClick={onParticipantClick}
      />
    </GameWindow>
  );
};

export default LadderGame;
