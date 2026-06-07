'use client';

import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {useState} from 'react';

import {MenuCategoryLabel} from '@/constants/menu';
import {cn} from '@/lib/utils';
import {MenuType} from '@/types/menu';
import {VoteResult, VoteType} from '@/types/vote';

interface CourseRowProps {
  menu: MenuType;
  index?: number;
  showVote?: boolean;
  voteResult?: VoteResult;
  onVote?: (type: VoteType) => void;
  isSubmitting?: boolean;
}

const CourseRow = ({
  menu,
  index = 0,
  showVote,
  voteResult,
  onVote,
  isSubmitting = false,
}: CourseRowProps) => {
  const [animating, setAnimating] = useState<VoteType | null>(null);

  const total = menu.items.reduce((sum, item) => sum + (item.kcal ?? 0), 0);
  const myVote = voteResult?.myVote ?? null;

  const handleVote = (type: VoteType) => {
    if (!onVote || isSubmitting) return;
    setAnimating(type);
    onVote(type);
    setTimeout(() => setAnimating(null), 300);
  };

  return (
    <div
      className="px-5 py-4"
      style={{animation: 'fadeUp 0.28s ease both', animationDelay: `${index * 70}ms`}}
    >
      <div className="mb-1.5 flex items-end gap-2">
        <span
          className="text-accent-text text-[13px] font-extrabold tracking-wider"
          style={{background: 'linear-gradient(transparent 40%, var(--color-highlight) 40%)', paddingInline: '2px'}}
        >
          {MenuCategoryLabel[menu.category].ko}
        </span>
        {total > 0 && (
          <span className="text-muted text-[10px] font-semibold">{total} kcal</span>
        )}
        {showVote && (
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              onClick={() => handleVote('up')}
              disabled={isSubmitting}
              aria-pressed={myVote === 'up'}
              aria-label="맛있어요"
              className={cn(
                'flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
                myVote === 'up' ? 'bg-accent-soft text-accent-text' : 'text-muted hover:text-ink',
                animating === 'up' && 'animate-[voteBounce_0.3s_ease-out]'
              )}
            >
              <ThumbsUp size={11} strokeWidth={2.5} />
              <span className="tabular-nums">
                {voteResult?.up_count ?? 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleVote('down')}
              disabled={isSubmitting}
              aria-pressed={myVote === 'down'}
              aria-label="별로예요"
              className={cn(
                'flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
                myVote === 'down' ? 'bg-down-soft text-down' : 'text-muted hover:text-ink',
                animating === 'down' && 'animate-[voteBounce_0.3s_ease-out]'
              )}
            >
              <ThumbsDown size={11} strokeWidth={2.5} />
              <span className="tabular-nums">
                {voteResult?.down_count ?? 0}
              </span>
            </button>
          </div>
        )}
      </div>
      <p className="text-ink text-[15px] leading-relaxed font-semibold">
        {menu.items.map((item, i) => (
          <span key={item.name} className="whitespace-nowrap">
            {item.name}
            {item.kcal > 0 && (
              <i className="text-muted ml-0.5 text-[10.5px] font-semibold not-italic">
                {`${item.kcal}kcal`}
              </i>
            )}
            {i < menu.items.length - 1 && (
              <span className="mx-1.5 text-[#C9C9C6]">·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
};

export default CourseRow;
