'use client';

import { useSlotMachine } from '@/hooks/useSlotMachine';

import { Reel } from './_Reel';
import { MIN_NAMES } from './SlotMachine.constants';
import {
  addBtnClass,
  cabinetClass,
  cabinetHeaderClass,
  cabinetTitleClass,
  chipClass,
  chipXClass,
  controlRowClass,
  dotClass,
  dotGroupClass,
  hintClass,
  inputClass,
  participantsLabelClass,
  reelsAreaClass,
  resetBtnClass,
  spinBtnClass,
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
    <div className="flex flex-col gap-4">
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
        >
          추가
        </button>
      </div>

      <div className={cabinetClass}>
        <div className={cabinetHeaderClass}>
          <div className={dotGroupClass}>
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
          </div>
          <span className={cabinetTitleClass}>MEGABOBS SLOTS</span>
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

      {names.length === 0 ? (
        <p className={hintClass}>
          이름을 {MIN_NAMES}명 이상 입력하면 뽑기를 시작할 수 있어요
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className={participantsLabelClass}>
            참여자 {names.length}명
          </div>
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
          {names.length < MIN_NAMES && (
            <p className={hintClass}>
              {MIN_NAMES - names.length}명 더 입력하면 시작할 수 있어요
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
