import {chipBg} from './DayBar.utils';
import {cn} from '@/utils/cn';

export const chipButtonClass = (isSelected: boolean, isToday: boolean) =>
  cn(
    'flex min-h-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 transition-colors duration-150',
    chipBg(isSelected, isToday),
  );
