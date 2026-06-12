'use client';

import { Maximize2, Minimize2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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
    shuffleParticipants,
    setItems,
    onParticipantClick,
  } = useLadderGame();
  const [isFullView, setIsFullView] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);

  const handleWiggle = () => {
    if (isWiggling) return;
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 400);
  };

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
    isWiggling,
    onParticipantsChange: changeParticipants,
    onItemsChange: setItems,
    onPlay: onCta,
    onAddPerson: addPerson,
    onWiggle: handleWiggle,
    onShuffle: shuffleParticipants,
    onParticipantClick,
    isFullView,
    onToggleFullView: () => setIsFullView((v) => !v),
  };

  return (
    <>
      {!isFullView && <GameView {...gameViewProps} />}
      <AnimatePresence>
        {isFullView && (
          <motion.div
            key="fullview"
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: GAME_BG }}
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <GameView {...gameViewProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface TitleBarProps {
  canAddPerson: boolean;
  isFullView: boolean;
  onAddPerson: () => void;
  onToggleFullView: () => void;
  onWiggle: () => void;
  onShuffle: () => void;
}

// eslint-disable-next-line max-lines-per-function
const TitleBar = ({
  canAddPerson,
  isFullView,
  onAddPerson,
  onToggleFullView,
  onWiggle,
  onShuffle,
}: TitleBarProps) => (
  <div
    className="flex items-center gap-3 px-3 py-2"
    style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
    }}
  >
    {/* Traffic lights — hover 시 글리프 표시 */}
    <div className="group flex gap-1.5 items-center">
      <button
        type="button"
        onClick={onWiggle}
        className="size-3 rounded-full flex items-center justify-center cursor-pointer focus-visible:outline-none"
        style={{ background: '#ff5f57' }}
        aria-label="사다리 흔들기"
      >
        <span className="invisible group-hover:visible text-[8px] font-black leading-none" style={{ color: '#7a1f1d' }}>×</span>
      </button>
      <button
        type="button"
        onClick={onShuffle}
        className="size-3 rounded-full flex items-center justify-center cursor-pointer focus-visible:outline-none"
        style={{ background: '#febc2e' }}
        aria-label="참가자 셔플"
      >
        <span className="invisible group-hover:visible text-[8px] font-black leading-none" style={{ color: '#7a5400' }}>−</span>
      </button>
      <button
        type="button"
        onClick={onToggleFullView}
        className="size-3 rounded-full flex items-center justify-center cursor-pointer focus-visible:outline-none"
        style={{ background: '#28c840' }}
        aria-label={isFullView ? '게임 화면 닫기' : '전체 화면으로 보기'}
      >
        <span className="invisible group-hover:visible" style={{ color: '#0c5a1a' }}>
          {isFullView ? <Minimize2 size={7} /> : <Maximize2 size={7} />}
        </span>
      </button>
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
        className="flex items-center gap-1 text-[11px] text-muted hover:text-ink cursor-pointer transition-colors px-2 py-0.5"
        aria-label={isFullView ? '게임 화면 닫기' : '전체 화면으로 보기'}
      >
        {isFullView ? (
          <>
            <Minimize2 size={10} />
            닫기
          </>
        ) : (
          <>
            <Maximize2 size={10} />
            전체보기
          </>
        )}
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
  isWiggling: boolean;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onPlay: () => void;
  onAddPerson: () => void;
  onWiggle: () => void;
  onShuffle: () => void;
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
  isWiggling,
  onParticipantsChange,
  onItemsChange,
  onPlay,
  onAddPerson,
  onWiggle,
  onShuffle,
  onParticipantClick,
  onToggleFullView,
}: GameViewProps) => (
  <div
    className={cn(
      'flex flex-col',
      isFullView
        ? 'flex-1'
        : 'overflow-hidden shadow-[0_4px_28px_rgba(0,0,0,0.18),_0_1px_4px_rgba(0,0,0,0.10)]',
      isWiggling && 'animate-[shake_0.4s_ease-in-out]'
    )}
  >
    <TitleBar
      canAddPerson={canAddPerson}
      isFullView={isFullView}
      onAddPerson={onAddPerson}
      onToggleFullView={onToggleFullView}
      onWiggle={onWiggle}
      onShuffle={onShuffle}
    />

    {/* Game content */}
    <div
      className={cn(
        gameWrapClass,
        isFullView && 'flex-1 overflow-y-auto max-w-xl mx-auto w-full'
      )}
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
        isFullView={isFullView}
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
