import { cn } from '@/utils/cn';

export const noticeBadgeClass =
  'bg-accent-soft text-accent-text inline-block px-2.5 py-1 text-xs font-extrabold tracking-wide';

export const noticeTitleClass =
  'mt-3 text-[27px] font-extrabold tracking-tight';

export const noticeDescClass = 'text-muted mt-2 text-[15px]';

export const articleClass = (isFirst: boolean) =>
  cn(
    'border-line flex gap-5 border-b px-1 py-5',
    isFirst && 'border-t-ink border-t-2'
  );

export const articleDateClass = 'block text-[17px] font-extrabold';

export const articleYearClass = 'text-muted block text-[11px]';

export const articleTitleClass =
  'flex items-center gap-2 text-base font-extrabold';

export const newBadgeClass =
  'bg-accent text-ink px-1.5 py-0.5 text-[9.5px] font-extrabold';

export const articleBodyClass =
  'text-ink-2 mt-1.5 text-[13.5px] leading-relaxed';

export const emptyNoticeClass =
  'border-t-ink text-muted border-t-2 px-1 py-12 text-center text-[13.5px]';
