import type { EggStep } from '@/hooks/useEasterEgg';
import { cn } from '@/utils/cn';

export const courseRowClass = 'flex h-full flex-col px-5 py-6';

export const courseRowHeaderClass = 'mb-1.5 flex items-end gap-2';

export const courseLabelClass =
  'text-accent-text text-[13px] font-extrabold tracking-wider';

export const eggLabelClass = (step: EggStep): string =>
  cn(
    step === 2 && 'text-accent-text animate-[wiggle_0.4s_ease_both]',
    step === 1 && 'animate-[wiggleSm_0.35s_ease_both]'
  );

export const kcalClass =
  'mt-3 flex justify-between border-t border-dashed border-line pt-3 text-muted text-[11px] font-semibold';

export const itemsTextClass =
  'mt-2 flex flex-1 flex-col gap-y-1 text-ink text-[14.5px] leading-relaxed font-semibold';

export const itemNameClass = 'flex items-center justify-between gap-2';

export const itemKcalClass =
  'text-muted shrink-0 text-[10px] font-semibold not-italic';

export const pickButtonClass = (isPicked: boolean, hasAnyPick: boolean) =>
  cn(
    'group ml-auto flex cursor-pointer items-center gap-1 px-2 py-0.5 text-[10px] font-medium leading-none transition-colors animate-[fadeIn_0.3s_ease_both]',
    isPicked
      ? 'bg-accent-soft text-accent-text'
      : hasAnyPick
        ? 'text-muted opacity-60 hover:text-ink hover:opacity-100'
        : 'text-muted hover:text-ink'
  );

export const pickCountClass = (hasCount: boolean) =>
  hasCount ? 'font-bold text-accent-text' : '';

export const pickHeartClass =
  'inline-flex transition-transform duration-150 group-hover:scale-125';
