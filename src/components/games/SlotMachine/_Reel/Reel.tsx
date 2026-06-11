import { REEL_ITEM_H } from '../SlotMachine.constants';

import { fadeBottomClass, fadeTopClass, reelItemClass, reelWindowClass, reelWrapClass } from './Reel.styles';
import type { ReelProps } from './Reel.types';

const WINDOW_H = REEL_ITEM_H * 3;

const Reel = ({ names, scrollPos, isSpinning, winner }: ReelProps) => {
  if (names.length === 0) {
    return (
      <div className={reelWrapClass}>
        <div
          className={reelWindowClass}
          style={{ height: WINDOW_H }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-ink/20 text-[13px] font-semibold">
            이름을 2명 이상 추가하세요
          </div>
        </div>
      </div>
    );
  }

  // The center item is whoever sits at scroll position
  const centerVirtualIdx = Math.round(scrollPos / REEL_ITEM_H);
  const firstVirtual = centerVirtualIdx - 1;
  const stopped = !isSpinning;

  const visibleItems = Array.from({ length: 5 }, (_, i) => {
    const virtualIdx = firstVirtual + i - 1;
    const nameIdx = ((virtualIdx % names.length) + names.length) % names.length;
    const top = virtualIdx * REEL_ITEM_H - scrollPos + REEL_ITEM_H;
    const isCenter = virtualIdx === centerVirtualIdx;
    const name = names[nameIdx];
    const isWinner = isCenter && name === winner && stopped;
    return { virtualIdx, name, top, isCenter, isWinner };
  });

  return (
    <div className={reelWrapClass}>
      <div
        className={reelWindowClass}
        style={{ height: WINDOW_H }}
      >
        {visibleItems.map(({ virtualIdx, name, top, isCenter, isWinner }) => (
          <div
            key={virtualIdx}
            className={reelItemClass(isCenter, isWinner, stopped)}
            style={{ top, height: REEL_ITEM_H }}
          >
            {name}
          </div>
        ))}
        <div className={fadeTopClass} />
        <div className={fadeBottomClass} />
      </div>
    </div>
  );
};

export default Reel;
