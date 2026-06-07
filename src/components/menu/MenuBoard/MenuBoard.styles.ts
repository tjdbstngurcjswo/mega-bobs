import { cn } from '@/utils/cn';

export const sectionClass = 'bg-surface flex flex-col shadow-[var(--shadow-card)]';

export const menuHeadingTitleClass =
  'text-ink text-[14px] font-extrabold tracking-wide';

export const menuHeadingLocationClass =
  'text-muted flex items-center gap-1 text-[11px] font-medium';

export const todayButtonClass = (isActive: boolean) =>
  cn(
    'flex items-center gap-1.5 border border-accent/50 bg-accent-soft px-3 py-1 text-[11px] font-bold text-accent-text transition-opacity hover:opacity-70',
    isActive ? 'invisible' : 'visible'
  );

export const footerNoteClass =
  'text-muted flex items-center gap-1.5 px-5 py-2.5 text-[10px] leading-relaxed';
