import { cn } from '@/utils/cn';

export const dayBarContainerClass = 'bg-surface flex flex-col';

export const weekLabelClass = 'flex items-center gap-0.5 px-4 pt-1.5 pb-0.5';

export const shareBtnClass =
  'flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-muted transition-colors duration-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink';

export const weekRangeClass =
  'flex-1 text-center text-[11px] font-semibold tabular-nums text-muted';

export const navButtonClass = (visible: boolean) =>
  cn(
    'group relative flex cursor-pointer items-center justify-center px-1 py-2 text-muted transition-opacity duration-100 hover:text-ink',
    !visible && 'invisible pointer-events-none'
  );

export const navArrowClass =
  'text-[14px] leading-none font-light transition-transform group-active:scale-75';

export const navTooltipClass =
  'pointer-events-none absolute top-full left-1/2 z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap bg-ink px-2 py-1 text-[10px] font-medium text-cream invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100';

export const todayBtnClass =
  'cursor-pointer bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent-text transition-colors hover:bg-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink';

export const chipAreaClass = 'px-4 pb-2.5';

export const chipRowClass = 'relative flex gap-1.5 overflow-hidden';

export const indicatorClass = (isToday: boolean) =>
  cn(
    'pointer-events-none absolute inset-y-0 transition-transform duration-200 ease-out',
    isToday ? 'bg-accent' : 'bg-ink'
  );

export const chipBg = (isSelected: boolean): string => {
  if (!isSelected) return 'hover:bg-surface-warm';
  return '';
};

const dowColor = (dow: number): string | null => {
  if (dow === 0) return 'text-rose-400/70';
  if (dow === 6) return 'text-sky-400/70';
  return null;
};

export const labelClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
): string => {
  if (isSelected) return isToday ? 'text-ink/55' : 'text-cream-2';
  if (isToday) return 'text-accent-text';
  return dowColor(dow) ?? 'text-muted';
};

export const dateClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
): string => {
  if (isSelected) return isToday ? 'text-ink' : 'text-cream';
  if (isToday) return 'text-accent-text';
  return dowColor(dow) ?? 'text-ink';
};
