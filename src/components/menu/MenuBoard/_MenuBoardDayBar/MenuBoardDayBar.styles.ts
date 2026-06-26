import { cn } from '@/utils/cn';

export const dayBarContainerClass = 'bg-surface flex flex-col';

export const topBarClass = 'flex items-center justify-between px-4 pt-3 pb-2.5';

export const monthLabelClass =
  'text-[22px] font-[800] text-ink tracking-[-0.02em] leading-none';

export const navGroupClass = 'flex items-center gap-0.5';

export const navIconBtnClass = (enabled: boolean) =>
  cn(
    'flex size-8 cursor-pointer items-center justify-center text-muted transition-colors hover:bg-surface-warm hover:text-ink',
    !enabled && 'invisible pointer-events-none'
  );

export const todayBtnClass =
  'flex h-8 cursor-pointer items-center px-3 text-[11px] font-[700] text-muted shadow-[var(--shadow-flat)] transition-colors hover:bg-surface-warm hover:text-ink';

export const shareBtnClass =
  'flex size-8 cursor-pointer items-center justify-center text-muted transition-colors hover:bg-surface-warm hover:text-ink';

export const dayGridClass = 'grid grid-cols-[44px_repeat(7,1fr)]';

export const weekNumCellClass =
  'flex items-center justify-center py-3 text-[10px] font-[600] text-muted';

export const dayColumnClass = (isSelected: boolean) =>
  cn(
    'relative flex min-h-[44px] cursor-pointer flex-col items-center justify-center py-2.5 transition-colors hover:bg-surface-warm',
    isSelected && 'bg-surface-warm'
  );

export const daySelectionBarClass =
  'absolute bottom-0 left-0 right-0 h-0.5 bg-accent';

export const dayLabelClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
) =>
  cn(
    'text-[11.5px] tabular-nums leading-none',
    isSelected
      ? 'font-[700] text-ink'
      : isToday
        ? 'font-[600] text-accent-text'
        : dow === 0 || dow === 6
          ? 'font-[600] text-muted opacity-50'
          : 'font-[600] text-ink-2'
  );
