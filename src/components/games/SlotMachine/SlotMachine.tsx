'use client';

import { useEffect, useRef, useState } from 'react';

import { useSlotMachine } from '@/hooks/useSlotMachine';

import { Reel } from './_Reel';
import {
  addBtnClass,
  cabinetClass,
  chipClass,
  chipXClass,
  controlRowClass,
  dotClass,
  dotGroupClass,
  fullscreenBtnClass,
  gameZoneClass,
  gameZoneInnerClass,
  inputClass,
  participantsLabelClass,
  reelsAreaClass,
  spinBtnClass,
} from './SlotMachine.styles';

// eslint-disable-next-line max-lines-per-function, complexity
const SlotMachine = () => {
  const {
    names,
    input,
    setInput,
    isSpinning,
    winner,
    isDuplicate,
    scrollPos,
    canSpin,
    addName,
    removeName,
    spin,
  } = useSlotMachine();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (zoneRef.current) {
      await zoneRef.current.requestFullscreen();
    }
  };

  return (
    <div ref={zoneRef} className={gameZoneClass(isFullscreen)}>
      <div className={gameZoneInnerClass(isFullscreen)}>
        <div className={cabinetClass}>
          <div className="flex items-center justify-between px-4 pt-4 pb-0">
            <div className={dotGroupClass}>
              <div className={dotClass} />
              <div className={dotClass} />
              <div className={dotClass} />
            </div>
            <button
              className={fullscreenBtnClass}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? '창 모드로 보기' : '전체화면으로 보기'}
              title={isFullscreen ? '창 모드' : '전체화면'}
            >
              {isFullscreen ? '⊡' : '⊞'}
            </button>
            <div className={dotGroupClass}>
              <div className={dotClass} />
              <div className={dotClass} />
              <div className={dotClass} />
            </div>
          </div>

          <div className={reelsAreaClass}>
            <Reel
              names={names}
              scrollPos={scrollPos}
              isSpinning={isSpinning}
              winner={winner}
            />

          </div>

          <div className={controlRowClass}>
            <button
              className={spinBtnClass}
              onClick={spin}
              disabled={!canSpin}
              aria-label="슬롯 돌리기"
            >
              {isSpinning ? 'SPINNING…' : 'SPIN'}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotMachine;
