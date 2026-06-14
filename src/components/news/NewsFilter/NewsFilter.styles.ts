import { cn } from '@/utils/cn';

export const filterBarClass = 'mb-6 flex items-center gap-1';

export const crawledAtIconClass = 'text-muted';

export const crawledAtTooltipClass = (isOpen: boolean) =>
  cn(
    'absolute right-0 top-full z-10 mt-1.5 whitespace-nowrap bg-board px-2.5 py-1.5 text-[11px] text-cream pointer-events-none transition-opacity group-hover:opacity-100',
    isOpen ? 'opacity-100' : 'opacity-0'
  );

export const filterButtonClass = (active: boolean) =>
  cn(
    'px-3 py-1.5 text-[13px] font-bold transition-colors',
    active ? 'bg-board text-cream' : 'text-muted hover:text-ink-2'
  );

export const newsGroupClass = 'flex flex-col gap-3';

export const dateHeaderClass =
  'text-muted text-[11.5px] font-extrabold tracking-[0.08em]';

export const emptyClass =
  'flex flex-col items-center gap-3 px-1 py-16 text-center';

export const emptyTitleClass = 'text-ink-2 text-[15px] font-extrabold';

export const loadMoreClass =
  'text-muted hover:text-ink-2 mx-auto mt-4 flex items-center gap-1.5 px-6 py-2.5 text-[13px] font-bold transition-colors';
