import { BOARD_EMPTY_COPY } from './constants';
import { BoardEmptyProps } from './BoardEmpty.types';

const BoardEmpty = ({ variant, date, isToday, isPast }: BoardEmptyProps) => {
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
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-accent-text text-[13px] font-black tracking-[0.3em]">
        {copy.label}
      </div>
      <h3 className="mt-3 text-[17px] font-extrabold">{closedTitle}</h3>
      {copy.body && (
        <p className="text-ink-2 mt-1.5 text-[13.5px] leading-relaxed">
          {copy.body}
        </p>
      )}
    </div>
  );
};

export default BoardEmpty;
