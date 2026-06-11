'use client';

import { useSlotMachine } from '@/hooks/useSlotMachine';

import { MIN_NAMES } from './SlotMachine.constants';
import {
  addBtnClass,
  chipClass,
  chipXClass,
  controlRowClass,
  drumDisplayClass,
  drumNameClass,
  drumWrapperClass,
  hintClass,
  hintInlineClass,
  inputClass,
  participantsLabelClass,
  participantsWrapperClass,
  resetBtnClass,
  resultBarClass,
  resultLabelClass,
  resultNameClass,
  spinBtnClass,
  statusLabelClass,
  winnerBadgeClass,
} from './SlotMachine.styles';

const SlotMachine = () => {
  const {
    names,
    input,
    setInput,
    isSpinning,
    winner,
    isDuplicate,
    canSpin,
    statusLabel,
    shownName,
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
          maxLength={20}
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

      <div className={drumWrapperClass}>
        <div className={drumDisplayClass}>
          <span className={statusLabelClass}>{statusLabel}</span>
          <span className={drumNameClass}>{shownName}</span>
        </div>

        {winner && (
          <div className={resultBarClass} aria-live="polite" aria-atomic="true">
            <div>
              <div className={resultLabelClass}>당첨자</div>
              <div className={resultNameClass}>{winner}</div>
            </div>
            <div className={winnerBadgeClass}>당첨!</div>
          </div>
        )}

        <div className={controlRowClass}>
          <button
            className={spinBtnClass}
            onClick={spin}
            disabled={!canSpin}
            aria-label="슬롯 돌리기"
          >
            {isSpinning
              ? '돌리는 중…'
              : `▶ 돌리기${canSpin ? ' (SPACE)' : ''}`}
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

        {names.length === 0 ? (
          <div className={hintClass}>
            이름을 {MIN_NAMES}명 이상 입력하면 뽑기를 시작할 수 있어요
          </div>
        ) : (
          <div className={participantsWrapperClass}>
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
              <p className={hintInlineClass}>
                {MIN_NAMES - names.length}명 더 입력하면 시작할 수 있어요
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotMachine;
