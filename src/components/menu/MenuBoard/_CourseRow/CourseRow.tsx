'use client';

import { ThumbsDown, ThumbsUp, Users } from 'lucide-react';
import { useState } from 'react';

import { MenuCategoryLabel } from '@/constants/menu';
import { CourseRowProps } from './CourseRow.types';

import {
  downVoteButtonClass,
  downVoteIconClass,
  pickButtonClass,
  upVoteButtonClass,
  upVoteIconClass,
} from './CourseRow.styles';

const TOOLTIP =
  "pointer-events-none invisible absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-ink before:content-['']";

const CourseRow = ({ menu, index = 0, vote, pick }: CourseRowProps) => {
  const [animating, setAnimating] = useState<'up' | 'down' | null>(null);

  const total = menu.items.reduce((sum, item) => sum + (item.kcal ?? 0), 0);
  const myVote = vote?.result?.myVote ?? null;

  const handleVote = (type: 'up' | 'down') => {
    if (!vote?.onVote || vote?.isSubmitting) return;
    setAnimating(type);
    vote.onVote(type);
    setTimeout(() => setAnimating(null), 300);
  };

  return (
    <div
      className="px-5 py-6"
      style={{
        animation: 'fadeUp 0.28s ease both',
        animationDelay: `${index * 70}ms`,
      }}
    >
      <div className="mb-1.5 flex items-end gap-2">
        <span
          className="text-accent-text text-[13px] font-extrabold tracking-wider"
          style={{
            background:
              'linear-gradient(transparent 40%, var(--color-highlight) 40%)',
            paddingInline: '2px',
          }}
        >
          {MenuCategoryLabel[menu.category].ko}
        </span>
        {total > 0 && (
          <span className="text-muted text-[11px] font-semibold">
            {total} kcal
          </span>
        )}
        {pick?.show && (
          <button
            type="button"
            onClick={pick.onPick}
            disabled={pick.isSubmitting}
            aria-pressed={pick.isPicked ?? false}
            aria-label={`${MenuCategoryLabel[menu.category].ko} 오늘 먹을 예정`}
            className={pickButtonClass(pick.isPicked ?? false)}
          >
            <Users size={10} strokeWidth={2.5} />
            {pick.count ?? 0}명이 선택했어요
          </button>
        )}
        {vote?.show && (
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              onClick={() => handleVote('up')}
              disabled={vote.isSubmitting}
              aria-pressed={myVote === 'up'}
              aria-label="맛있어요"
              className={upVoteButtonClass(myVote)}
            >
              <span className={upVoteIconClass(animating)}>
                <ThumbsUp size={11} strokeWidth={2.5} />
              </span>
              <span className="tabular-nums">
                {vote.result?.up_count ?? 0}
              </span>
              <span className={TOOLTIP}>맛있었어요</span>
            </button>
            <button
              type="button"
              onClick={() => handleVote('down')}
              disabled={vote.isSubmitting}
              aria-pressed={myVote === 'down'}
              aria-label="별로예요"
              className={downVoteButtonClass(myVote)}
            >
              <span className={downVoteIconClass(animating)}>
                <ThumbsDown size={11} strokeWidth={2.5} />
              </span>
              <span className="tabular-nums">
                {vote.result?.down_count ?? 0}
              </span>
              <span className={TOOLTIP}>별로였어요</span>
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
              <span className="text-line mx-1.5">·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
};

export default CourseRow;
