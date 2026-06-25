import { cn } from '@/utils/cn';

import { chipBg, labelClass, dateClass } from './MenuBoardDayBar.styles';

export const chipButtonClass = (
  isSelected: boolean,
  isToday: boolean,
  justSelected: boolean,
  isWeekend: boolean
) =>
  cn(
    'relative flex min-h-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 transition-colors duration-150 active:opacity-70',
    chipBg(isSelected),
    isToday &&
      !isSelected &&
      "after:absolute after:bottom-1.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:bg-accent after:content-['']",
    justSelected && 'animate-[chipPop_0.22s_ease-out]',
    isWeekend && !isSelected && !isToday && 'opacity-50'
  );

export const chipDowClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
) => cn('text-[10px] font-bold', labelClass(isSelected, isToday, dow));

export const chipDateClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
) => cn('text-[13.5px] font-extrabold', dateClass(isSelected, isToday, dow));
