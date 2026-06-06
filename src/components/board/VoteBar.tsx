'use client';

import {useState} from 'react';

import {cn} from '@/lib/utils';
import {VoteResult, VoteType} from '@/types/vote';

interface VoteBarProps {
  menuKey: string;
  result: VoteResult | undefined;
  onVote: (type: VoteType) => void;
}

const VoteBar = ({menuKey, result, onVote}: VoteBarProps) => {
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
      className="flex items-center gap-2 border-t border-line px-4 py-2"
      aria-label={`${menuKey} 맛평가`}
    >
      <span className="mr-1 text-[10px] font-medium text-muted">맛있었나요?</span>
      <button
        type="button"
        onClick={() => handleVote('up')}
        aria-pressed={myVote === 'up'}
        aria-label="맛있어요"
        className={cn(
          'flex items-center gap-1 border px-2 py-0.5 text-[11px] font-semibold transition-colors',
          myVote === 'up'
            ? 'border-accent bg-accent text-ink'
            : 'border-line bg-surface text-muted hover:border-accent/60 hover:text-ink',
          animating === 'up' && 'animate-[voteBounce_0.3s_ease-out]'
        )}
      >
        <span>👍</span>
        {hasVoted && (
          <span className="tabular-nums">{result?.up_count ?? 0}</span>
        )}
      </button>
      <button
        type="button"
        onClick={() => handleVote('down')}
        aria-pressed={myVote === 'down'}
        aria-label="별로예요"
        className={cn(
          'flex items-center gap-1 border px-2 py-0.5 text-[11px] font-semibold transition-colors',
          myVote === 'down'
            ? 'border-down bg-down-soft text-ink'
            : 'border-line bg-surface text-muted hover:border-down/60 hover:text-ink',
          animating === 'down' && 'animate-[voteBounce_0.3s_ease-out]'
        )}
      >
        <span>👎</span>
        {hasVoted && (
          <span className="tabular-nums">{result?.down_count ?? 0}</span>
        )}
      </button>
    </div>
  );
};

export default VoteBar;
