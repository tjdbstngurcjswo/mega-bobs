'use client';

import { ThumbsDown, ThumbsUp, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { MenuCategoryLabel } from '@/constants/menu';
import { cn } from '@/utils/cn';

import {
  tooltipClass,
  courseRowClass,
  courseRowHeaderClass,
  courseLabelClass,
  downVoteButtonClass,
  downVoteIconClass,
  eggLabelClass,
  itemKcalClass,
  itemNameClass,
  itemsTextClass,
  kcalClass,
  pickButtonClass,
  pickCountClass,
  tabularNumsClass,
  upVoteButtonClass,
  upVoteIconClass,
  voteGroupClass,
} from './MenuBoardCourseRow.styles';
import { MenuBoardCourseRowProps } from './MenuBoardCourseRow.types';

const MenuBoardCourseRow = ({
  menu,
  vote,
  pick,
  onHeaderClick,
  eggStep = 0,
}: MenuBoardCourseRowProps) => {
  const [animating, setAnimating] = useState<'up' | 'down' | null>(null);
  const [longPressTarget, setLongPressTarget] = useState<'up' | 'down' | null>(
    null
  );
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressActivated = useRef(false);

  const total = menu.items.reduce((sum, item) => sum + (item.kcal ?? 0), 0);
  const myVote = vote?.result?.myVote ?? null;

  const startLongPress = (type: 'up' | 'down') => {
    longPressActivated.current = false;
    longPressTimer.current = setTimeout(() => {
      setLongPressTarget(type);
      longPressActivated.current = true;
    }, 500);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  useEffect(() => {
    const dismiss = () => setLongPressTarget(null);
    document.addEventListener('touchstart', dismiss);
    return () => document.removeEventListener('touchstart', dismiss);
  }, []);

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
          key={eggStep}
          className={cn(courseLabelClass, eggLabelClass(eggStep))}
          style={{
            background:
              'linear-gradient(transparent 40%, var(--color-highlight) 40%)',
            paddingInline: '2px',
          }}
          onClick={onHeaderClick}
          role={onHeaderClick ? 'button' : undefined}
          tabIndex={onHeaderClick ? 0 : undefined}
          onKeyDown={
            onHeaderClick
              ? (e) => e.key === 'Enter' && onHeaderClick()
              : undefined
          }
        >
          {MenuCategoryLabel[menu.category].ko}
        </span>
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
            <span className={pickCountClass((pick.count ?? 0) >= 1)}>
              {pick.count ?? 0}
            </span>
            명이 선택했어요
          </button>
        )}
        {vote?.show && (
          <div className={voteGroupClass}>
            <button
              type="button"
              onClick={() => {
                if (longPressActivated.current) {
                  longPressActivated.current = false;
                  return;
                }
                handleVote('up');
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                startLongPress('up');
              }}
              onTouchEnd={cancelLongPress}
              onTouchMove={cancelLongPress}
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
              <span className={tooltipClass(longPressTarget === 'up')}>
                맛있었어요
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (longPressActivated.current) {
                  longPressActivated.current = false;
                  return;
                }
                handleVote('down');
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                startLongPress('down');
              }}
              onTouchEnd={cancelLongPress}
              onTouchMove={cancelLongPress}
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
              <span className={tooltipClass(longPressTarget === 'down')}>
                별로였어요
              </span>
            </button>
          </div>
        )}
      </div>
      <p className={itemsTextClass}>
        {menu.items.map((item) => (
          <span key={item.name} className={itemNameClass}>
            <span className="break-words">{item.name}</span>
            {item.kcal > 0 && (
              <i className={itemKcalClass}>{`${item.kcal}kcal`}</i>
            )}
          </span>
        ))}
      </p>
      {total > 0 && (
        <p className={kcalClass}>
          <span>합계</span>
          <span>{total} kcal</span>
        </p>
      )}
    </div>
  );
};

export default MenuBoardCourseRow;
