import { cn } from '@/utils/cn';

export const articleClass = (isFirst: boolean) =>
  cn(
    'border-line flex cursor-pointer gap-5 border-b px-1 py-5 transition-colors hover:bg-surface-warm',
    isFirst && 'border-t-ink border-t-2'
  );

export const articleDateClass = 'block text-[17px] font-extrabold';

export const articleYearClass = 'text-muted block text-[11px]';

export const articleTitleClass =
  'flex items-center gap-2 overflow-hidden text-base font-extrabold';

export const newBadgeClass =
  'bg-accent text-ink px-1.5 py-0.5 text-[9.5px] font-extrabold';

export const articleBodyClass =
  'text-ink-2 mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed';

export const emptyNoticeClass =
  'border-t-ink text-muted border-t-2 px-1 py-12 text-center text-[13.5px]';
