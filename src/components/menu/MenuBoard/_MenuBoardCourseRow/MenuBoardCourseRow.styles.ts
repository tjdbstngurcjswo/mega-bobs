import { VoteType } from '@/models/vote';
import { cn } from '@/utils/cn';

const TOOLTIP_BASE =
  'pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 whitespace-nowrap bg-ink dark:bg-board px-2 py-1 text-[10px] font-medium text-cream transition-opacity before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-ink dark:before:border-b-board before:content-[""]';

export const tooltipClass = (isOpen: boolean) =>
  cn(
    TOOLTIP_BASE,
    isOpen
      ? 'visible opacity-100'
      : 'invisible opacity-0 group-hover:visible group-hover:opacity-100'
  );

export const courseRowClass = 'flex h-full flex-col px-5 py-6';

export const courseRowHeaderClass = 'mb-1.5 flex items-end gap-2';

export const courseLabelClass =
  'text-accent-text text-[13px] font-extrabold tracking-wider';

export const kcalClass =
  'mt-3 flex justify-between border-t border-dashed border-line pt-3 text-muted text-[11px] font-semibold';

export const voteGroupClass =
  'ml-auto flex gap-1 animate-[fadeIn_0.3s_ease_both]';

export const itemsTextClass =
  'mt-2 flex flex-1 flex-col gap-y-1 text-ink text-[14.5px] leading-relaxed font-semibold';

export const itemNameClass = 'flex items-center justify-between gap-2';

export const itemKcalClass =
  'text-muted shrink-0 text-[10px] font-semibold not-italic';

export const tabularNumsClass = 'tabular-nums';

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

export const upVoteButtonClass = (myVote: VoteType | null) =>
  cn(
    'group relative flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
    myVote === 'up'
      ? 'bg-accent-soft text-accent-text'
      : 'text-muted hover:text-ink'
  );

export const downVoteButtonClass = (myVote: VoteType | null) =>
  cn(
    'group relative flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
    myVote === 'down' ? 'bg-down-soft text-down' : 'text-muted hover:text-ink'
  );

export const upVoteIconClass = (animating: VoteType | null) =>
  cn(
    'inline-flex transition-transform group-hover:-translate-y-0.5',
    animating === 'up' && 'animate-[thumbsUpBounce_0.45s_ease-out]'
  );

export const downVoteIconClass = (animating: VoteType | null) =>
  cn(
    'inline-flex transition-transform group-hover:translate-y-0.5',
    animating === 'down' && 'animate-[thumbsDownBounce_0.45s_ease-out]'
  );
