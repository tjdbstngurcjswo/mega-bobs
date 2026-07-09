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
    phase,
    seed,
    ladderData,
    revealed,
    animating,
    play,
    revealOne,
    revealAll,
    retry,
    addPerson,
    changeParticipants,
    setItems,
    shuffleParticipants,
  } = useLadderGame();

  const canPlay =
    participants.length >= 2 &&
    items.length >= 2 &&
    participants.length === items.length;
  const canAddPerson = phase === 'input';
  const allRevealed =
    phase === 'result' && revealed.size === participants.length;

  const ctaLabel =
    phase === 'animating'
      ? '확인 중…'
      : allRevealed
        ? '↺ 다시하기'
        : '한번에 결과 보기';
  const ctaDisabled = phase === 'animating' || (phase === 'input' && !canPlay);
  const onCta = allRevealed
    ? retry
    : phase === 'input'
      ? () => play()
      : revealAll;

  const onParticipantClick = (i: number) => {
    if (phase === 'input') play(i);
    else if (phase === 'result' && !revealed.has(i)) revealOne(i);
  };

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
      <div className={gameWrapClass}>
        <_LadderBoard
          key={`board-${seed}`}
          participants={participants}
          items={items}
          data={ladderData}
          phase={phase}
          reveal={{ revealed, animating }}
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
