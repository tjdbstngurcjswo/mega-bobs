'use client';

import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {useState} from 'react';

import {cn} from '@/lib/utils';
import {VoteResult, VoteType} from '@/types/vote';

interface VoteBarProps {
  menuKey: string;
  label: string;
  result: VoteResult | undefined;
  onVote: (type: VoteType) => void;
}

const VoteBar = ({menuKey, label, result, onVote}: VoteBarProps) => {
  const [animating, setAnimating] = useState<VoteType | null>(null);

  const myVote = result?.myVote ?? null;
  const hasVoted = myVote !== null;

  const handleVote = (type: VoteType) => {
    setAnimating(type);
    onVote(type);
    setTimeout(() => setAnimating(null), 300);
  };

  return (
    <div
      className="flex items-center px-5 py-2.5"
      aria-label={`${label} 맛평가`}
    >
      <span className="text-[10px] text-muted">맛있었나요?</span>
      <div className="ml-auto flex gap-1.5">
        <button
          type="button"
          onClick={() => handleVote('up')}
          aria-pressed={myVote === 'up'}
          aria-label="맛있어요"
          className={cn(
            'flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors',
            myVote === 'up'
              ? 'bg-accent-soft text-accent-text'
              : 'text-muted hover:text-ink',
            animating === 'up' && 'animate-[voteBounce_0.3s_ease-out]'
          )}
        >
          <ThumbsUp size={11} strokeWidth={2.5} />
          <span className={cn('tabular-nums', !hasVoted && 'invisible w-0 overflow-hidden')}>
            {result?.up_count ?? 0}
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleVote('down')}
          aria-pressed={myVote === 'down'}
          aria-label="별로예요"
          className={cn(
            'flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors',
            myVote === 'down'
              ? 'bg-down-soft text-down'
              : 'text-muted hover:text-ink',
            animating === 'down' && 'animate-[voteBounce_0.3s_ease-out]'
          )}
        >
          <ThumbsDown size={11} strokeWidth={2.5} />
          <span className={cn('tabular-nums', !hasVoted && 'invisible w-0 overflow-hidden')}>
            {result?.down_count ?? 0}
          </span>
        </button>
      </div>
    </div>
  );
};

export default VoteBar;
