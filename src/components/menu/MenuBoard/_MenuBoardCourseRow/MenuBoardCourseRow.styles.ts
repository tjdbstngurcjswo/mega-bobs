import { cn } from '@/utils/cn';
import { VoteType } from '@/models/vote';

export const TOOLTIP =
  "pointer-events-none invisible absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-ink before:content-['']";

export const courseRowClass = 'px-5 py-6';

export const courseRowHeaderClass = 'mb-1.5 flex items-end gap-2';

export const courseLabelClass =
  'text-accent-text text-[13px] font-extrabold tracking-wider';

export const kcalClass = 'text-muted text-[11px] font-semibold';

export const voteGroupClass = 'ml-auto flex gap-1';

export const itemsTextClass =
  'mt-2 flex flex-wrap gap-x-0.5 text-ink text-[14.5px] leading-relaxed font-semibold';

export const itemNameClass = 'whitespace-nowrap';

export const itemKcalClass =
  'text-muted ml-0.5 text-[10px] font-semibold not-italic';

export const itemSeparatorClass = 'text-line mx-1.5 select-none';

export const tabularNumsClass = 'tabular-nums';

export const pickButtonClass = (isPicked: boolean) =>
  cn(
    'ml-auto flex items-center gap-1 border px-2 py-0.5 text-[10px] font-medium leading-none transition-colors',
    isPicked
      ? 'border-accent bg-accent-soft text-accent-text'
      : 'border-line text-muted hover:border-accent/50 hover:text-ink'
  );

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
