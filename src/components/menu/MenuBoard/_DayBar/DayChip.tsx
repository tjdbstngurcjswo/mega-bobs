'use client';

import {dateClass, labelClass} from './day-bar';
import {cn} from '@/lib/utils';

import {DOW} from './constants';
import {DayChipProps} from './DayBar.types';

import {chipButtonClass} from './DayChip.styles';

const DayChip = ({day, today, selectedDate, onSelect, mounted}: DayChipProps) => {
  const isToday = mounted && day.isSame(today, 'day');
  const isSelected = mounted && day.isSame(selectedDate, 'day');

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-pressed={isSelected}
      className={chipButtonClass(isSelected, isToday)}
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
