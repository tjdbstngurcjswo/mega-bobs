'use client';

import { useState } from 'react';

import { cn } from '@/utils/cn';
import type { LadderData } from '@/utils/ladder';

import { _LadderBoard } from './_LadderBoard';
import { ctaButtonClass, gameWrapClass } from './LadderGame.styles';
import type { LadderPhase } from './LadderGame.types';
import { useLadderGame } from './useLadderGame';

const GAME_BG =
  'radial-gradient(ellipse 70% 60% at 15% 25%, rgba(74,127,193,0.22), transparent 65%),' +
  'radial-gradient(ellipse 60% 70% at 85% 75%, rgba(224,92,82,0.16), transparent 65%),' +
  'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(74,172,115,0.1), transparent 70%),' +
  'var(--color-bg)';

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
    setItems,
    onParticipantClick,
  } = useLadderGame();
  const [isFullView, setIsFullView] = useState(false);

  if (!loaded) return null;

  const gameViewProps = {
    participants,
    items,
    phase,
    seed,
    ladderData: displayLadderData,
    revealedSet,
    animatingSet,
    borderReadySet,
    ctaLabel,
    ctaDisabled,
    canAddPerson,
    onParticipantsChange: changeParticipants,
    onItemsChange: setItems,
    onPlay: onCta,
    onAddPerson: addPerson,
    onParticipantClick,
    isFullView,
    onToggleFullView: () => setIsFullView((v) => !v),
  };

  if (isFullView) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: GAME_BG }}>
        <GameView {...gameViewProps} />
      </div>
    );
  }

  return <GameView {...gameViewProps} />;
};

interface GameViewProps {
  participants: string[];
  items: string[];
  phase: LadderPhase;
  seed: number;
  ladderData: LadderData | null;
  revealedSet: Set<number>;
  animatingSet: Set<number>;
  borderReadySet: Set<number>;
  ctaLabel: string;
  ctaDisabled: boolean;
  canAddPerson: boolean;
  isFullView: boolean;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onPlay: () => void;
  onAddPerson: () => void;
  onParticipantClick: (i: number) => void;
  onToggleFullView: () => void;
}

const GameView = ({
  participants,
  items,
  phase,
  seed,
  ladderData,
  revealedSet,
  animatingSet,
  borderReadySet,
  ctaLabel,
  ctaDisabled,
  canAddPerson,
  isFullView,
  onParticipantsChange,
  onItemsChange,
  onPlay,
  onAddPerson,
  onParticipantClick,
  onToggleFullView,
}: GameViewProps) => (
  <div
    className={cn(gameWrapClass, isFullView && 'flex-1 justify-center')}
    style={{
      background: isFullView ? undefined : GAME_BG,
      padding: '16px',
      boxShadow:
        'inset 0 0 0 1px rgba(255,255,255,0.22), 0 8px 40px rgba(0,0,0,0.1)',
    }}
  >
    <div className="flex justify-between items-center">
      <button
        type="button"
        onClick={onToggleFullView}
        className="text-[11px] cursor-pointer text-muted hover:text-ink transition-colors"
        aria-label={isFullView ? '게임 화면 닫기' : '전체 화면으로 보기'}
      >
        {isFullView ? '← 닫기' : '전체 보기'}
      </button>
      {canAddPerson && (
        <button
          type="button"
          onClick={onAddPerson}
          className="text-[11px] cursor-pointer text-muted hover:text-ink transition-colors"
          aria-label="인원 추가"
        >
          + 인원 추가
        </button>
      )}
    </div>
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
      onClick={onPlay}
      disabled={ctaDisabled}
      aria-disabled={ctaDisabled}
      aria-label="사다리 결과 확인"
    >
      {ctaLabel}
    </button>
  </div>
);

export default LadderGame;
