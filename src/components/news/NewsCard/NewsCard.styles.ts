import { cn } from '@/utils/cn';

const base = cn(
  'animate-[fadeUp_0.25s_ease_both] cursor-pointer',
  'transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]',
  'active:scale-[0.99]'
);

export const featuredWrapperClass = cn(
  'bg-surface shadow-[var(--shadow-card)] flex flex-col gap-[10px] py-5 pr-5 pl-[17px]',
  '[border-left:3px_solid_var(--color-accent)]',
  base
);

export const compactWrapperClass = cn(
  'bg-surface shadow-[var(--shadow-card)] flex flex-col gap-1 px-5 py-3',
  base
);

export const sourceChipClass =
  'bg-surface-warm text-ink-2 text-[11px] font-semibold px-2 py-0.5 w-fit tracking-[0.03em]';

export const featuredTitleClass =
  'text-ink text-[17px] font-extrabold leading-snug tracking-[-0.02em] break-keep';

export const featuredDescClass =
  'text-ink-2 text-[13px] leading-relaxed line-clamp-3 break-keep';

export const compactTitleClass =
  'text-ink text-[13.5px] font-bold leading-snug line-clamp-1 break-keep';

export const cardMetaClass = 'text-muted text-[11.5px] flex items-center gap-2';
