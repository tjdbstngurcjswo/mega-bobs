'use client';

import {DOW} from '@/constants/date';
import {chipBg, dateClass, labelClass} from '@/lib/day-bar';
import {cn} from '@/lib/utils';
import {DayChipProps} from '@/types/board';

const DayChip = ({day, today, selectedDate, onSelect, mounted}: DayChipProps) => {
  const isToday = mounted && day.isSame(today, 'day');
  const isSelected = mounted && day.isSame(selectedDate, 'day');

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-pressed={isSelected}
      className={cn(
        'flex min-h-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 transition-colors duration-150',
        chipBg(isSelected, isToday),
      )}
    >
      <span
        suppressHydrationWarning
        className={cn('text-[10px] font-bold', labelClass(isSelected, isToday, day.day()))}
      >
        {isToday ? '오늘' : DOW[day.day()]}
      </span>
      <span
        suppressHydrationWarning
        className={cn('text-[13.5px] font-extrabold', dateClass(isSelected, isToday, day.day()))}
      >
        {day.date()}
      </span>
    </button>
  );
};

export default DayChip;
