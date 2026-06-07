'use client';

import { dateClass, labelClass } from './MenuBoardDayBar.styles';
import { cn } from '@/utils/cn';

import { DOW } from './MenuBoardDayBar.constants';
import { MenuBoardDayChipProps } from './MenuBoardDayBar.types';

import { chipButtonClass } from './MenuBoardDayChip.styles';

const MenuBoardDayChip = ({
  day,
  today,
  selectedDate,
  onSelect,
  mounted,
}: MenuBoardDayChipProps) => {
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
        className={cn(
          'text-[10px] font-bold',
          labelClass(isSelected, isToday, day.day())
        )}
      >
        {isToday ? '오늘' : DOW[day.day()]}
      </span>
      <span
        suppressHydrationWarning
        className={cn(
          'text-[13.5px] font-extrabold',
          dateClass(isSelected, isToday, day.day())
        )}
      >
        {day.date()}
      </span>
    </button>
  );
};

export default MenuBoardDayChip;
