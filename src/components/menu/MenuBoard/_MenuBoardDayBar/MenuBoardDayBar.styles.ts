import { cn } from '@/utils/cn';

export const dayBarContainerClass = 'bg-(--color-board) flex flex-col';

export const topBarClass = 'flex items-center justify-between px-4 pt-3 pb-2.5';

export const monthLabelClass =
  'text-[22px] font-[800] text-(--color-cream) tracking-[-0.02em] leading-none';

export const navGroupClass = 'flex items-center gap-0.5';

export const navIconBtnClass = (enabled: boolean) =>
  cn(
    'flex size-8 cursor-pointer items-center justify-center text-(--color-cream-2) transition-colors hover:bg-(--color-board-2) hover:text-(--color-cream)',
    !enabled && 'invisible pointer-events-none'
  );

export const todayBtnClass =
  'flex h-8 cursor-pointer items-center px-3 text-[11px] font-[700] text-(--color-cream-2) ring-1 ring-(--color-board-2) transition-colors hover:bg-(--color-board-2) hover:text-(--color-cream)';

export const shareBtnClass =
  'flex size-8 cursor-pointer items-center justify-center text-(--color-cream-2) transition-colors hover:bg-(--color-board-2) hover:text-(--color-cream)';

export const dayGridClass = 'grid grid-cols-[44px_repeat(7,1fr)]';

export const weekNumCellClass =
  'flex items-center justify-center py-3 text-[10px] font-[600] text-(--color-cream-2)';

export const dayColumnClass = (isSelected: boolean) =>
  cn(
    'relative flex min-h-[44px] cursor-pointer flex-col items-center justify-center py-2.5 transition-colors hover:bg-(--color-board-2)',
    isSelected && 'bg-(--color-board-2)'
  );

export const daySelectionBarClass =
  'absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent)';

export const dayLabelClass = (
  isSelected: boolean,
  isToday: boolean,
  dow: number
) =>
  cn(
    'text-[11.5px] tabular-nums leading-none',
    isSelected
      ? 'font-[700] text-(--color-cream)'
      : isToday
        ? 'font-[600] text-(--color-accent)'
        : dow === 0 || dow === 6
          ? 'font-[600] text-(--color-cream-2) opacity-40'
          : 'font-[600] text-(--color-cream-2)'
  );
