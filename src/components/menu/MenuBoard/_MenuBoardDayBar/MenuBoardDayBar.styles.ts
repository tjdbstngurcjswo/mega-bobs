import { cn } from '@/utils/cn';

export const dayBarContainerClass = 'flex flex-col';

export const topBarClass = 'flex items-center justify-between px-4 pt-3 pb-2.5';

export const weekInfoClass = 'flex items-baseline gap-1.5 leading-none';

export const weekLabelTextClass = 'text-[13px] font-[700] text-ink';

export const weekRangeTextClass = 'text-[11px] font-[500] text-muted';

export const navGroupClass = 'flex items-center gap-0.5';

export const navIconBtnClass = (enabled: boolean) =>
  cn(
    'flex size-11 items-center justify-center transition-colors',
    enabled
      ? 'cursor-pointer text-muted hover:bg-surface hover:text-ink'
      : 'cursor-default text-muted opacity-40'
  );

export const todayBtnClass =
  'relative cursor-pointer px-3 py-1 text-[11px] font-[700] text-muted transition-colors hover:bg-surface hover:text-ink after:absolute after:content-[""] after:-inset-x-1.5 after:-inset-y-3';

export const dayGridClass = 'grid grid-cols-7 gap-1 px-2 pb-1';

export const dayColumnClass = (isSelected: boolean) =>
  cn(
    'relative flex min-h-[44px] cursor-pointer flex-col items-center justify-center gap-1 rounded-t-lg py-2.5 transition-colors',
    isSelected ? 'hover:bg-line/60' : 'hover:bg-surface-warm'
  );

export const daySelectionBarClass =
  'absolute bottom-0 left-0 right-0 h-0.5 bg-accent';

export const dayDowClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
) =>
  cn(
    'text-[13px] font-[700] leading-none',
    isSelected
      ? 'text-ink'
      : isToday
        ? 'text-accent-text'
        : dow === 0 || dow === 6
          ? 'text-muted'
          : 'text-ink-2'
  );

export const dayDateClass = (isSelected: boolean, isToday: boolean) =>
  cn(
    'text-[11px] font-[500] tabular-nums leading-none',
    isSelected ? 'text-ink-2' : isToday ? 'text-accent-text' : 'text-muted'
  );
