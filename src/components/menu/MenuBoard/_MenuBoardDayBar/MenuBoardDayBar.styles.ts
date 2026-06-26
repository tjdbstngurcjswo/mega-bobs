import { cn } from '@/utils/cn';

export const dayBarContainerClass = 'bg-surface flex flex-col';

export const weekLabelClass = 'flex items-center gap-1 px-2 pt-2 pb-1';

export const weekNavGroupClass = 'flex flex-1 items-center';

export const shareBtnClass =
  'flex cursor-pointer items-center justify-center p-1.5 text-muted transition-colors hover:text-ink';

export const weekRangeClass =
  'flex-1 text-center text-[15px] font-bold tabular-nums text-ink';

export const navButtonClass = (visible: boolean) =>
  cn(
    'group relative flex cursor-pointer items-center justify-center px-2 py-2.5 text-muted transition-opacity duration-100 hover:text-ink',
    !visible && 'invisible pointer-events-none'
  );

export const navArrowClass =
  'text-[20px] leading-none font-light transition-transform group-active:scale-75';

export const navTooltipClass =
  'pointer-events-none absolute top-full left-1/2 z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap bg-ink px-2 py-1 text-[10px] font-medium text-cream invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100';

export const chipAreaClass = 'px-4 pb-2.5';

export const chipRowClass = 'relative flex gap-1.5 overflow-hidden';

export const indicatorClass = (isToday: boolean) =>
  cn(
    'pointer-events-none absolute inset-y-0 transition-transform duration-200 ease-out',
    isToday ? 'bg-accent' : 'bg-board'
  );

export const chipBg = (isSelected: boolean): string => {
  if (!isSelected) return 'hover:bg-surface-warm';
  return '';
};

const dowColor = (dow: number): string | null => {
  if (dow === 0 || dow === 6) return 'text-muted';
  return null;
};

export const labelClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
): string => {
  if (isSelected) return isToday ? 'text-board/55' : 'text-cream-2';
  if (isToday) return 'text-accent-text';
  return dowColor(dow) ?? 'text-muted';
};

export const dateClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
): string => {
  if (isSelected) return isToday ? 'text-board' : 'text-cream';
  if (isToday) return 'text-accent-text';
  return dowColor(dow) ?? 'text-ink';
};
