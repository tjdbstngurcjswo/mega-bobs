'use client';

import { Shuffle } from 'lucide-react';

import { GameWindow } from '@/components/@shared';

import { _LadderBoard } from './_LadderBoard';
import { ctaButtonClass, gameWrapClass } from './LadderGame.styles';
import { useLadderGame } from './useLadderGame';

const LadderGame = () => {
  const {
    participants,
    items,
    loaded,
    phase,
    seed,
    displayLadderData,
    canAddPerson,
    reveal,
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
      <div className={gameWrapClass} style={{ padding: '16px' }}>
        <_LadderBoard
          key={`board-${seed}`}
          participants={participants}
          items={items}
          data={displayLadderData}
          phase={phase}
          reveal={reveal}
          onParticipantsChange={changeParticipants}
          onItemsChange={setItems}
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
    </GameWindow>
  );
};

export default LadderGame;
