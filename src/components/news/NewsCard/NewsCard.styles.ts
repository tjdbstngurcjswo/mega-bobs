import { cn } from '@/utils/cn';

export const cardWrapperClass = cn(
  'bg-surface shadow-[var(--shadow-card)] flex flex-col gap-2 px-5 py-4',
  'animate-[fadeUp_0.25s_ease_both] cursor-pointer',
  'transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]',
  'active:scale-[0.99]'
);

export const cardTitleClass =
  'text-ink text-[14px] font-bold leading-snug line-clamp-1 break-keep';

export const cardDescClass =
  'text-ink-2 text-[13px] leading-relaxed line-clamp-2 break-keep';

export const cardMetaClass = 'text-muted text-[12px] flex items-center gap-2';
