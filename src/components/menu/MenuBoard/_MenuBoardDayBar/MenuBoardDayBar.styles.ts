import { cn } from '@/utils/cn';

export const dayBarContainerClass = 'bg-surface flex flex-col';

export const weekLabelClass = 'flex items-center gap-1 px-4 pt-1.5 pb-0.5';

export const weekRangeClass =
  'flex-1 text-center text-[11px] font-semibold tabular-nums text-muted';

export const navButtonClass = (visible: boolean) =>
  cn(
    'flex cursor-pointer items-center justify-center px-1 py-2 text-muted transition-opacity duration-100 hover:text-ink active:scale-75',
    !visible && 'invisible pointer-events-none'
  );

export const navArrowClass = 'text-[14px] leading-none font-light';

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
