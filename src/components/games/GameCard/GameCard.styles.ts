import { cn } from '@/utils/cn';

export const cardClass = (isComingSoon: boolean) =>
  cn(
    'bg-surface shadow-[var(--shadow-card)] flex flex-col gap-2 px-5 py-4',
    isComingSoon
      ? 'cursor-default opacity-50'
      : 'cursor-pointer transition-shadow hover:shadow-[var(--shadow-card-hover)]'
  );

export const cardTitleClass = 'text-ink text-[15px] font-extrabold';

export const cardDescClass = 'text-ink-2 text-[13px]';

export const cardBadgeClass =
  'shrink-0 bg-down-soft text-down px-1.5 py-0.5 text-[9.5px] font-extrabold';
