import { chipBg, labelClass, dateClass } from './MenuBoardDayBar.styles';
import { cn } from '@/utils/cn';

export const chipButtonClass = (isSelected: boolean, isToday: boolean) =>
  cn(
    'flex min-h-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 transition-colors duration-150',
    chipBg(isSelected, isToday)
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
