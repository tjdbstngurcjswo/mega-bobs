import {cn} from '@/utils/cn';

export const cardWrapperClass = (isComingSoon: boolean) =>
  cn(
    'bg-surface shadow-[var(--shadow-card)] relative flex flex-col px-5 py-4 group overflow-hidden',
    isComingSoon
      ? 'cursor-default'
      : 'cursor-pointer transition-shadow hover:shadow-[var(--shadow-card-hover)]'
  );

export const cardContentClass = (isComingSoon: boolean) =>
  cn('flex flex-col gap-2', isComingSoon && 'opacity-50');

export const cardTitleClass = 'text-ink text-[15px] font-extrabold';

export const cardDescClass = 'text-ink-2 text-[13px]';

export const cardBadgeClass =
  'shrink-0 bg-down-soft text-down px-1.5 py-0.5 text-[9.5px] font-extrabold animate-[softPulse_2s_ease-in-out_infinite]';

export const cardIconClass =
  'text-muted shrink-0 group-hover:animate-[wiggle_0.4s_ease-in-out]';

export const cardToastClass = (isEasterEgg: boolean) =>
  cn(
    'absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-semibold animate-[fadeUp_0.2s_ease-out]',
    isEasterEgg
      ? 'bg-accent-soft text-accent-text'
      : 'bg-surface-warm text-ink-2'
  );
