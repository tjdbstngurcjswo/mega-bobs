'use client';

import { useEffect, useState } from 'react';

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
  const isWeekend = day.day() === 0 || day.day() === 6;
  const [justSelected, setJustSelected] = useState(false);

  useEffect(() => {
    if (!isSelected) return;
    setJustSelected(true);
    const t = setTimeout(() => setJustSelected(false), 220);
    return () => clearTimeout(t);
  }, [isSelected]);

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-pressed={isSelected}
      className={chipButtonClass(isSelected, isToday, justSelected, isWeekend)}
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
