'use client';

import { DOW } from './MenuBoardDayBar.constants';
import { MenuBoardDayChipProps } from './MenuBoardDayBar.types';

import {
  chipButtonClass,
  chipDateClass,
  chipDowClass,
} from './MenuBoardDayChip.styles';

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
        className={chipDowClass(isSelected, isToday, day.day())}
      >
        {isToday ? '오늘' : DOW[day.day()]}
      </span>
      <span
        suppressHydrationWarning
        className={chipDateClass(isSelected, isToday, day.day())}
      >
        {day.date()}
      </span>
    </button>
  );
};

export default MenuBoardDayChip;
