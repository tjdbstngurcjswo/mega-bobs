import { cn } from '@/utils/cn';

export const dayBarContainerClass =
  'bg-surface flex items-center gap-2 px-4 py-3';

export const navButtonClass = (canGo: boolean) =>
  cn(
    'flex min-h-[44px] w-8 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 transition-opacity duration-100 active:scale-75',
    canGo ? 'text-muted hover:text-ink' : 'cursor-default opacity-25'
  );

export const navArrowClass = 'text-[16px] leading-none font-light';

export const chipBg = (isSelected: boolean, isToday: boolean): string => {
  if (!isSelected) return 'bg-transparent hover:bg-surface-warm';
  return isToday ? 'bg-accent' : 'bg-ink';
};

const dowColor = (dow: number): string | null => {
  if (dow === 0) return 'text-red-500';
  if (dow === 6) return 'text-blue-500';
  return null;
};

export const labelClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
): string => {
  if (isSelected) return isToday ? 'text-ink/55' : 'text-white/60';
  return dowColor(dow) ?? 'text-muted';
};

export const dateClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
): string => {
  if (isSelected) return isToday ? 'text-ink' : 'text-white';
  return dowColor(dow) ?? 'text-ink';
};
