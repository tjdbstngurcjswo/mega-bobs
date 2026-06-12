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

interface TitleBarProps {
  canAddPerson: boolean;
  isFullView: boolean;
  onAddPerson: () => void;
  onToggleFullView: () => void;
}

const TitleBar = ({
  canAddPerson,
  isFullView,
  onAddPerson,
  onToggleFullView,
}: TitleBarProps) => (
  <div
    className="flex items-center gap-3 px-3 py-2"
    style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
    }}
  >
    <div className="flex gap-1.5 items-center">
      <span className="block size-3 rounded-full" style={{ background: '#ff5f57' }} aria-hidden="true" />
      <span className="block size-3 rounded-full" style={{ background: '#febc2e' }} aria-hidden="true" />
      <span className="block size-3 rounded-full" style={{ background: '#28c840' }} aria-hidden="true" />
    </div>
    <div className="flex-1" />
    <div className="flex items-center gap-1">
      {canAddPerson && (
        <button
          type="button"
          onClick={onAddPerson}
          className="text-[11px] text-muted hover:text-ink cursor-pointer transition-colors px-2 py-0.5"
          aria-label="인원 추가"
        >
          + 인원 추가
        </button>
      )}
      <button
        type="button"
        onClick={onToggleFullView}
        className="text-[11px] text-muted hover:text-ink cursor-pointer transition-colors px-2 py-0.5"
        aria-label={isFullView ? '게임 화면 닫기' : '전체 화면으로 보기'}
      >
        {isFullView ? '← 닫기' : '전체보기'}
      </button>
    </div>
  </div>
);

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
    className={cn(
      'flex flex-col overflow-hidden',
      isFullView
        ? 'flex-1'
        : 'shadow-[0_4px_28px_rgba(0,0,0,0.18),_0_1px_4px_rgba(0,0,0,0.10)]'
    )}
  >
    <TitleBar
      canAddPerson={canAddPerson}
      isFullView={isFullView}
      onAddPerson={onAddPerson}
      onToggleFullView={onToggleFullView}
    />

    {/* Game content */}
    <div
      className={cn(gameWrapClass, isFullView && 'flex-1 justify-center')}
      style={{
        background: isFullView ? 'transparent' : GAME_BG,
        padding: '16px',
      }}
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
        onClick={onPlay}
        disabled={ctaDisabled}
        aria-disabled={ctaDisabled}
        aria-label="사다리 결과 확인"
      >
        {ctaLabel}
      </button>
    </div>
  </div>
);

export default LadderGame;
