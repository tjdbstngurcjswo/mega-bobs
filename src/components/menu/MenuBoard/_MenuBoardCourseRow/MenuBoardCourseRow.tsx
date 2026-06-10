'use client';

import { ThumbsDown, ThumbsUp, Users } from 'lucide-react';
import { useState } from 'react';

import { MenuCategoryLabel } from '@/constants/menu';

import {
  TOOLTIP,
  courseRowClass,
  courseRowHeaderClass,
  courseLabelClass,
  downVoteButtonClass,
  downVoteIconClass,
  itemKcalClass,
  itemNameClass,
  itemSeparatorClass,
  itemsTextClass,
  kcalClass,
  pickButtonClass,
  tabularNumsClass,
  upVoteButtonClass,
  upVoteIconClass,
  voteGroupClass,
} from './MenuBoardCourseRow.styles';
import { MenuBoardCourseRowProps } from './MenuBoardCourseRow.types';

const MenuBoardCourseRow = ({ menu, vote, pick }: MenuBoardCourseRowProps) => {
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
    <div className={courseRowClass}>
      <div className={courseRowHeaderClass}>
        <span
          className={courseLabelClass}
          style={{
            background:
              'linear-gradient(transparent 40%, var(--color-highlight) 40%)',
            paddingInline: '2px',
          }}
        >
          {MenuCategoryLabel[menu.category].ko}
        </span>
        {total > 0 && <span className={kcalClass}>{total} kcal</span>}
        {pick?.show && (
          <button
            type="button"
            onClick={pick.onPick}
            disabled={pick.isSubmitting}
            aria-pressed={pick.isPicked ?? false}
            aria-label={`${MenuCategoryLabel[menu.category].ko} ${pick.isPicked ? '선택됨 — 클릭하면 취소' : pick.hasAnyPick ? '다른 코스로 변경' : '오늘 먹을 예정'}`}
            className={pickButtonClass(
              pick.isPicked ?? false,
              pick.hasAnyPick ?? false
            )}
          >
            <Users size={10} strokeWidth={2.5} />
            {pick.count ?? 0}명이 선택했어요
          </button>
        )}
        {vote?.show && (
          <div className={voteGroupClass}>
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
              <span className={tabularNumsClass}>
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
              <span className={tabularNumsClass}>
                {vote.result?.down_count ?? 0}
              </span>
              <span className={TOOLTIP}>별로였어요</span>
            </button>
          </div>
        )}
      </div>
      <p className={itemsTextClass}>
        {menu.items.map((item, i) => (
          <span key={item.name} className={itemNameClass}>
            {item.name}
            {item.kcal > 0 && (
              <i className={itemKcalClass}>{`${item.kcal}kcal`}</i>
            )}
            {i < menu.items.length - 1 && (
              <span className={itemSeparatorClass}>·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
};

export default MenuBoardCourseRow;
