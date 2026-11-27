'use client';

import { Check, Heart } from 'lucide-react';

import { MenuCategoryLabel } from '@/constants/menu';
import { cn } from '@/utils/cn';

import {
  courseLabelClass,
  courseRowClass,
  courseRowHeaderClass,
  eggLabelClass,
  itemKcalClass,
  itemNameClass,
  itemsTextClass,
  kcalClass,
  pickButtonClass,
  pickCountClass,
  pickHeartClass,
} from './MenuBoardCourseRow.styles';
import { MenuBoardCourseRowProps } from './MenuBoardCourseRow.types';

const MenuBoardCourseRow = ({
  menu,
  pick,
  onHeaderClick,
  eggStep = 0,
}: MenuBoardCourseRowProps) => {
  const total = menu.items.reduce((sum, item) => sum + (item.kcal ?? 0), 0);
  const label = MenuCategoryLabel[menu.category].ko;

  return (
    <div className={courseRowClass}>
      <div className={courseRowHeaderClass}>
        <span
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
          {label}
        </span>
        {pick?.show && (
          <button
            type="button"
            onClick={pick.onPick}
            disabled={pick.isSubmitting}
            aria-pressed={pick.isPicked ?? false}
            aria-label={`${label} ${pick.isPicked ? '선택됨 — 클릭하면 취소' : pick.hasAnyPick ? '다른 코스로 변경' : '오늘 먹을 예정'}`}
            className={pickButtonClass(
              pick.isPicked ?? false,
              pick.hasAnyPick ?? false
            )}
          >
            {pick.hasAnyPick ? (
              <>
                <Check size={10} strokeWidth={2.5} />
                <span className={pickCountClass((pick.count ?? 0) >= 1)}>
                  {pick.count ?? 0}
                </span>
                명
              </>
            ) : (
              <span className={pickHeartClass}>
                <Heart size={10} strokeWidth={2.5} />
              </span>
            )}
          </button>
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
          <span>총 칼로리</span>
          <span>{total} kcal</span>
        </p>
      )}
    </div>
  );
};

export default MenuBoardCourseRow;
