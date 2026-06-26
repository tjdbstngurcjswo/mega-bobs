'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useEffect } from 'react';

import { useHasMounted } from '@/hooks/useHasMounted';
import { useDateStore } from '@/store/useDateStore';

import { DOW } from './MenuBoardDayBar.constants';
import {
  dayBarContainerClass,
  dayColumnClass,
  dayGridClass,
  dayLabelClass,
  daySelectionBarClass,
  monthLabelClass,
  navGroupClass,
  navIconBtnClass,
  shareBtnClass,
  todayBtnClass,
  topBarClass,
  weekNumCellClass,
} from './MenuBoardDayBar.styles';
import { MenuBoardDayBarProps } from './MenuBoardDayBar.types';

const MenuBoardDayBar = ({ onShare }: MenuBoardDayBarProps) => {
  const {
    today,
    selectedDate,
    currentWeek,
    minDate,
    maxDate,
    setSelectedDate,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    refreshToday,
  } = useDateStore();
  const mounted = useHasMounted();

  useEffect(() => {
    const id = setInterval(refreshToday, 60_000);
    return () => clearInterval(id);
  }, [refreshToday]);

  const canGoPrev = !mounted || currentWeek[0].isAfter(minDate, 'day');
  const canGoNext = !mounted || currentWeek[6].isBefore(maxDate, 'day');

  return (
    <div className={dayBarContainerClass}>
      <div className={topBarClass}>
        <span suppressHydrationWarning className={monthLabelClass}>
          {mounted ? currentWeek[0].format('YYYY년 M월') : ''}
        </span>
        <div className={navGroupClass}>
          <button
            type="button"
            onClick={() => {
              sendGAEvent('event', 'week_navigate', { direction: 'prev' });
              goToPrevWeek();
            }}
            aria-label="지난주 메뉴 보기"
            className={navIconBtnClass(canGoPrev)}
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={goToToday}
            aria-label="오늘로 이동"
            className={todayBtnClass}
          >
            오늘
          </button>
          <button
            type="button"
            onClick={() => {
              sendGAEvent('event', 'week_navigate', { direction: 'next' });
              goToNextWeek();
            }}
            aria-label="다음주 메뉴 보기"
            className={navIconBtnClass(canGoNext)}
          >
            <ChevronRight size={16} strokeWidth={2} aria-hidden />
          </button>
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              aria-label="메뉴 링크 공유"
              className={shareBtnClass}
            >
              <Share2 size={14} strokeWidth={2} aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className={dayGridClass}>
        <div suppressHydrationWarning className={weekNumCellClass}>
          {mounted ? `${currentWeek[0].format('w')}주` : ''}
        </div>
        {currentWeek.map((day) => {
          const isSelected = mounted && day.isSame(selectedDate, 'day');
          const isToday = mounted && day.isSame(today, 'day');
          const dow = day.day();
          return (
            <button
              key={day.format('YYYY-MM-DD')}
              type="button"
              onClick={() => {
                sendGAEvent('event', 'day_select', {
                  offset: day.diff(today, 'day'),
                });
                setSelectedDate(day);
              }}
              aria-pressed={isSelected}
              className={dayColumnClass(isSelected)}
            >
              {isSelected && <span className={daySelectionBarClass} />}
              <span
                suppressHydrationWarning
                className={dayLabelClass(isSelected, isToday, dow)}
              >
                {day.date()}일 ({isToday ? '오늘' : DOW[dow]})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MenuBoardDayBar;
