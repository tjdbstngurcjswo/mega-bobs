import { cn } from '@/utils/cn';

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
