import { cn } from '@/utils/cn';

export const gameWrapClass = 'flex flex-col gap-3';

export const inputColsClass = 'grid grid-cols-2 gap-2.5';

export const inputBoxClass =
  'bg-surface shadow-[var(--shadow-card)] p-3 flex flex-col gap-2';

export const colLabelClass = (variant: 'p' | 'i') =>
  cn(
    'text-[10px] font-extrabold uppercase tracking-[0.08em]',
    variant === 'p' ? 'text-accent-text' : 'text-ink-2'
  );

export const tagsWrapClass = 'flex flex-wrap gap-1.5 min-h-[26px]';

export const tagClass = (variant: 'p' | 'i') =>
  cn(
    'inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold',
    'animate-[chipPop_0.18s_ease-out]',
    variant === 'p'
      ? 'bg-accent-soft text-accent-text'
      : 'bg-surface-warm text-ink-2'
  );

export const tagRemoveClass =
  'opacity-50 hover:opacity-100 cursor-pointer leading-none shrink-0';

export const inputRowClass = 'flex gap-1.5';

export const inputFieldClass =
  'min-w-0 flex-1 bg-bg border border-line px-2.5 py-1.5 text-[12px] text-ink placeholder:text-muted outline-none focus-visible:border-ink';

export const addButtonClass = (disabled: boolean | undefined) =>
  cn(
    'shrink-0 w-8 text-[16px] font-bold border border-line bg-bg transition-colors',
    disabled
      ? 'text-muted cursor-not-allowed'
      : 'text-ink-2 cursor-pointer hover:bg-surface-warm hover:border-ink'
  );

export const ladderCardClass =
  'bg-board shadow-[var(--shadow-card)] px-4 pt-3 pb-4';

export const ladderNamesRowClass = 'flex mb-2';

export const ladderNameClass =
  'flex-1 text-center text-[10px] font-extrabold uppercase tracking-[0.04em] text-cream-2 overflow-hidden text-ellipsis whitespace-nowrap px-1';

export const ladderItemsRowClass = 'flex mt-2';

export const ladderItemClass = (active: boolean) =>
  cn(
    'flex-1 text-center text-[10px] overflow-hidden text-ellipsis whitespace-nowrap px-1 font-bold',
    active ? 'text-accent font-extrabold' : 'text-ink-2'
  );

export const addPersonButtonClass = (disabled: boolean) =>
  cn(
    'shrink-0 px-4 py-3.5 text-[13px] font-bold shadow-[var(--shadow-card)] transition-colors',
    disabled
      ? 'bg-down-soft text-down cursor-not-allowed'
      : 'bg-surface text-ink-2 cursor-pointer hover:text-ink'
  );

export const ctaButtonClass = (disabled: boolean) =>
  cn(
    'w-full py-3.5 text-[14px] font-extrabold shadow-[var(--shadow-card)] transition-colors',
    disabled
      ? 'bg-down-soft text-down cursor-not-allowed'
      : 'bg-accent text-ink cursor-pointer hover:bg-accent-deep'
  );

export const resultListClass = 'flex flex-col gap-2';

export const resultRowClass = (winner: boolean) =>
  cn(
    'flex items-center gap-2.5 px-4 py-3 shadow-[var(--shadow-flat)]',
    winner ? 'bg-board' : 'bg-surface'
  );

export const resultNameClass = (winner: boolean) =>
  cn(
    'min-w-[44px] text-[13px] font-bold break-keep',
    winner ? 'text-cream-2' : 'text-ink-2'
  );

export const resultArrowClass = (winner: boolean) =>
  cn('text-[11px]', winner ? 'text-cream-2' : 'text-muted');

export const resultValueClass = (winner: boolean) =>
  cn(
    'text-[13px] font-bold break-keep',
    winner ? 'text-accent font-extrabold text-[14px]' : 'text-ink'
  );

export const resultBadgeClass =
  'ml-auto text-[9px] font-extrabold uppercase tracking-[0.08em] text-accent bg-board-2 px-1.5 py-0.5';

export const retryButtonClass =
  'w-full py-3 bg-surface text-ink-2 text-[13px] font-semibold shadow-[var(--shadow-card)] cursor-pointer hover:text-ink transition-colors';
