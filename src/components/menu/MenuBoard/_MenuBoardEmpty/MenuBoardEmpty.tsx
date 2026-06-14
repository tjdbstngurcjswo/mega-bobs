'use client';

import { Plane, Sparkles } from 'lucide-react';

import { BOARD_EMPTY_COPY } from './MenuBoardEmpty.constants';
import {
  emptyBodyClass,
  emptyLabelClass,
  emptyTitleClass,
} from './MenuBoardEmpty.styles';
import { MenuBoardEmptyProps } from './MenuBoardEmpty.types';

const SPARKLE_POSITIONS = [
  { left: '18%', bottom: '22%', size: 13, delay: '0s' },
  { left: '42%', bottom: '12%', size: 10, delay: '-1.2s' },
  { left: '65%', bottom: '28%', size: 12, delay: '-2.4s' },
  { left: '80%', bottom: '15%', size: 9, delay: '-0.6s' },
];

const MenuBoardEmpty = ({
  variant,
  date,
  isToday,
  isPast,
}: MenuBoardEmptyProps) => {
  const copy = BOARD_EMPTY_COPY[variant];

  const closedTitle = (() => {
    if (variant !== 'closed') return copy.title;
    const dateStr = date
      ? `${parseInt(date.slice(5, 7), 10)}월 ${parseInt(date.slice(8, 10), 10)}일은 `
      : '';
    if (isToday) return '오늘은 구내식당이 쉬는 날이에요';
    if (isPast) return `${dateStr}쉬는 날이었어요`;
    return `${dateStr}${copy.title}`;
  })();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      {variant === 'closed' && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span
            className="text-muted absolute top-1/2 left-1/2 -translate-y-1/2"
            style={{ animation: 'planeFly 7s linear infinite' }}
          >
            <Plane size={15} strokeWidth={1.5} />
          </span>
          <span
            className="text-muted absolute top-1/2 left-1/2 -translate-y-1/2 opacity-50"
            style={{ animation: 'planeFly 7s linear -3.5s infinite' }}
          >
            <Plane size={12} strokeWidth={1.5} />
          </span>
        </div>
      )}
      {variant === 'comingUp' && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {SPARKLE_POSITIONS.map((s, i) => (
            <span
              key={i}
              className="text-accent absolute"
              style={{
                left: s.left,
                bottom: s.bottom,
                animation: `floatUp 3.6s ease-in-out ${s.delay} infinite`,
              }}
            >
              <Sparkles size={s.size} strokeWidth={1.5} />
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <div className={emptyLabelClass}>{copy.label}</div>
        <h3 className={emptyTitleClass}>{closedTitle}</h3>
        {copy.body && !(variant === 'closed' && isPast) && (
          <p className={emptyBodyClass}>{copy.body}</p>
        )}
      </div>
    </div>
  );
};

export default MenuBoardEmpty;
