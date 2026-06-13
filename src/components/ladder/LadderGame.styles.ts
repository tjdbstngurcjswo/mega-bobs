import { cn } from '@/utils/cn';

export const gameWrapClass = 'flex flex-col gap-3';

export const ctaButtonClass = (disabled: boolean) =>
  cn(
    'w-full py-3.5 text-[14px] font-extrabold shadow-[var(--shadow-card)] transition-colors',
    disabled
      ? 'bg-down-soft text-down cursor-not-allowed'
      : 'bg-accent text-ink cursor-pointer hover:bg-accent-deep'
  );
