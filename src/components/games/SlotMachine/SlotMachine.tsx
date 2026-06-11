'use client';

import { useSlotMachine } from '@/hooks/useSlotMachine';

import { Reel } from './_Reel';
import {
  addBtnClass,
  cabinetClass,
  cabinetTitleClass,
  chipClass,
  chipXClass,
  controlRowClass,
  dotClass,
  dotGroupClass,
  gameZoneClass,
  inputClass,
  participantsLabelClass,
  reelsAreaClass,
  resetBtnClass,
  spinBtnClass,
  winnerBannerClass,
} from './SlotMachine.styles';

// eslint-disable-next-line max-lines-per-function
const SlotMachine = () => {
  const {
    names,
    input,
    setInput,
    isSpinning,
    winner,
    isDuplicate,
    reel,
    canSpin,
    addName,
    removeName,
    spin,
    reset,
  } = useSlotMachine();

  return (
    <div className={gameZoneClass}>
      <div className={cabinetClass}>
        <div className="flex items-center justify-between px-4 pt-4 pb-0">
          <div className={dotGroupClass}>
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
          </div>
          <span className={cabinetTitleClass}>SLOTS</span>
          <div className={dotGroupClass}>
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
          </div>
        </div>

        <div className={reelsAreaClass}>
          <Reel
            items={reel.items}
            stopped={reel.stopped}
            isWinner={!!winner && reel.stopped}
          />
          <div className="mt-3 flex h-5 items-center justify-center">
            <span className={winnerBannerClass(!!winner && reel.stopped)}>
              {winner && reel.stopped ? `— ${winner} —` : ''}
            </span>
          </div>
        </div>

        <div className={controlRowClass}>
          <button
            className={spinBtnClass}
            onClick={spin}
            disabled={!canSpin}
            aria-label="슬롯 돌리기"
          >
            {isSpinning
              ? '돌리는 중…'
              : `▶  돌리기${canSpin ? ' (SPACE)' : ''}`}
          </button>
          <button
            className={resetBtnClass}
            onClick={reset}
            disabled={isSpinning}
            aria-label="초기화"
          >
            ↺
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className={inputClass(isDuplicate)}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addName()}
          placeholder="이름 입력 후 Enter"
          disabled={isSpinning}
          maxLength={12}
          aria-label="참여자 이름 입력"
        />
        <button
          className={addBtnClass}
          onClick={addName}
          disabled={isSpinning || !input.trim()}
          aria-label="참여자 추가"
        >
          +
        </button>
      </div>

      {names.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className={participantsLabelClass}>참여자 {names.length}명</div>
          <div className="flex flex-wrap gap-1.5">
            {names.map((name) => (
              <div key={name} className={chipClass(name === winner)}>
                <span>{name}</span>
                {!isSpinning && (
                  <button
                    onClick={() => removeName(name)}
                    className={chipXClass}
                    aria-label={`${name} 삭제`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
