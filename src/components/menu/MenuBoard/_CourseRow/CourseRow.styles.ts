import {cn} from '@/utils/utils';
import {VoteType} from '@/types/vote';

export const pickButtonClass = (isPicked: boolean) =>
  cn(
    'ml-auto flex items-center gap-1 border px-2 py-0.5 text-[10px] font-medium leading-none transition-colors',
    isPicked
      ? 'border-accent bg-accent-soft text-accent-text'
      : 'border-line text-muted hover:border-accent/50 hover:text-ink',
  );

export const upVoteButtonClass = (myVote: VoteType | null) =>
  cn(
    'group relative flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
    myVote === 'up' ? 'bg-accent-soft text-accent-text' : 'text-muted hover:text-ink',
  );

export const downVoteButtonClass = (myVote: VoteType | null) =>
  cn(
    'group relative flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
    myVote === 'down' ? 'bg-down-soft text-down' : 'text-muted hover:text-ink',
  );

export const upVoteIconClass = (animating: VoteType | null) =>
  cn(
    'inline-flex transition-transform group-hover:-translate-y-0.5',
    animating === 'up' && 'animate-[thumbsUpBounce_0.45s_ease-out]',
  );

export const downVoteIconClass = (animating: VoteType | null) =>
  cn(
    'inline-flex transition-transform group-hover:translate-y-0.5',
    animating === 'down' && 'animate-[thumbsDownBounce_0.45s_ease-out]',
  );
