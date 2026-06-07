import { Plane } from 'lucide-react';

import { BOARD_EMPTY_COPY } from './MenuBoardEmpty.constants';
import { MenuBoardEmptyProps } from './MenuBoardEmpty.types';
import {
  emptyBodyClass,
  emptyLabelClass,
  emptyTitleClass,
} from './MenuBoardEmpty.styles';

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

  const showPlane = variant === 'closed';

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      {showPlane && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span
            className="absolute left-1/2 top-1/2 -translate-y-1/2 text-muted"
            style={{ animation: 'planeFly 7s linear infinite' }}
          >
            <Plane size={15} strokeWidth={1.5} />
          </span>
          <span
            className="absolute left-1/2 top-1/2 -translate-y-1/2 text-muted opacity-50"
            style={{ animation: 'planeFly 7s linear -3.5s infinite' }}
          >
            <Plane size={12} strokeWidth={1.5} />
          </span>
        </div>
      )}
      <div className="relative">
        <div className={emptyLabelClass}>{copy.label}</div>
        <h3 className={emptyTitleClass}>{closedTitle}</h3>
        {copy.body && <p className={emptyBodyClass}>{copy.body}</p>}
      </div>
    </div>
  );
};

export default MenuBoardEmpty;
