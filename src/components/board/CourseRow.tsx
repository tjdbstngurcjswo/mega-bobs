'use client';

import {ThumbsDown, ThumbsUp, Users} from 'lucide-react';
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
  showPick?: boolean;
  pickCount?: number;
  isPicked?: boolean;
  onPick?: () => void;
  isSubmittingPick?: boolean;
}

const CourseRow = ({
  menu,
  index = 0,
  showVote,
  voteResult,
  onVote,
  isSubmitting = false,
  showPick = false,
  pickCount = 0,
  isPicked = false,
  onPick,
  isSubmittingPick = false,
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
      className="px-5 py-6"
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
          <span className="text-muted text-[11px] font-semibold">{total} kcal</span>
        )}
        {showPick && (
          <button
            type="button"
            onClick={onPick}
            disabled={isSubmittingPick}
            aria-pressed={isPicked}
            aria-label={`${MenuCategoryLabel[menu.category].ko} 오늘 먹을 예정`}
            className={cn(
              'ml-auto flex items-center gap-1 border px-2 py-0.5 text-[10px] font-medium leading-none transition-colors',
              isPicked
                ? 'border-accent bg-accent-soft text-accent-text'
                : 'border-line text-muted hover:border-accent/50 hover:text-ink'
            )}
          >
            <Users size={10} strokeWidth={2.5} />
            {pickCount}명이 선택했어요
          </button>
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
                'group relative flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
                myVote === 'up' ? 'bg-accent-soft text-accent-text' : 'text-muted hover:text-ink',
              )}
            >
              <span className={cn(
                'inline-flex transition-transform group-hover:-translate-y-0.5',
                animating === 'up' && 'animate-[thumbsUpBounce_0.45s_ease-out]'
              )}>
                <ThumbsUp size={11} strokeWidth={2.5} />
              </span>
              <span className="tabular-nums">{voteResult?.up_count ?? 0}</span>
              <span className="pointer-events-none invisible absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-ink before:content-['']">
                맛있었어요
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleVote('down')}
              disabled={isSubmitting}
              aria-pressed={myVote === 'down'}
              aria-label="별로예요"
              className={cn(
                'group relative flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
                myVote === 'down' ? 'bg-down-soft text-down' : 'text-muted hover:text-ink',
              )}
            >
              <span className={cn(
                'inline-flex transition-transform group-hover:translate-y-0.5',
                animating === 'down' && 'animate-[thumbsDownBounce_0.45s_ease-out]'
              )}>
                <ThumbsDown size={11} strokeWidth={2.5} />
              </span>
              <span className="tabular-nums">{voteResult?.down_count ?? 0}</span>
              <span className="pointer-events-none invisible absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-ink before:content-['']">
                별로였어요
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
              <span className="mx-1.5 text-line">·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
};

export default CourseRow;
