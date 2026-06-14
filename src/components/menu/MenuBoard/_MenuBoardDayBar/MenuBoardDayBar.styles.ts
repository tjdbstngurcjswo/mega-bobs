import { cn } from '@/utils/cn';

export const dayBarContainerClass = 'bg-surface flex flex-col';

export const weekLabelClass = 'px-4 pt-2.5 pb-0.5';

export const weekRangeClass =
  'block text-center text-[11px] font-semibold tabular-nums text-muted';

export const chipAreaClass = 'flex items-center gap-2 px-4 pb-2.5';

export const navButtonClass = (canGo: boolean) =>
  cn(
    'flex min-h-[44px] w-8 shrink-0 cursor-pointer items-center justify-center transition-opacity duration-100 active:scale-75',
    canGo ? 'text-muted hover:text-ink' : 'cursor-default opacity-25'
  );

export const navArrowClass = 'text-[16px] leading-none font-light';

export const chipRowClass = 'relative flex flex-1 gap-1.5 overflow-hidden';

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
  if (dow === 0 || dow === 6) return 'text-muted';
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
