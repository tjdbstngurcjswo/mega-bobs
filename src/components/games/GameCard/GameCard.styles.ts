import { cn } from '@/utils/cn';

export const cardWrapperClass =
  'group bg-surface shadow-[var(--shadow-card)] relative flex flex-col overflow-hidden p-6';

export const cardNumberClass =
  'text-surface-warm pointer-events-none absolute top-0 right-3 text-[64px] leading-none font-extrabold tracking-[-0.03em]';

export const cardHeaderClass = 'relative flex items-center gap-2';

export const cardIconClass =
  'text-muted shrink-0 group-hover:animate-[wiggle_0.4s_ease-in-out]';

export const cardTitleClass = 'text-ink text-[15px] font-extrabold';

export const cardDescClass = 'text-ink-2 relative mt-2 text-[13px]';

export const cardBadgeClass =
  'bg-down-soft text-down relative mt-3 inline-block self-start px-1.5 py-0.5 text-[9.5px] font-extrabold animate-[softPulse_2s_ease-in-out_infinite]';

export const cardToastClass = (isEasterEgg: boolean) =>
  cn(
    'absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-semibold animate-[fadeUp_0.2s_ease-out]',
    isEasterEgg
      ? 'bg-accent-soft text-accent-text'
      : 'bg-surface-warm text-ink-2'
  );
