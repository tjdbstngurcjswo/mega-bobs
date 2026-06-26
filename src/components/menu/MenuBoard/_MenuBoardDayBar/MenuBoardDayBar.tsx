'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useHasMounted } from '@/hooks/useHasMounted';
import { useDateStore } from '@/store/useDateStore';

import { DOW } from './MenuBoardDayBar.constants';
import {
  dayBarContainerClass,
  dayColumnClass,
  dayDateClass,
  dayDowClass,
  dayGridClass,
  daySelectionBarClass,
  navGroupClass,
  navIconBtnClass,
  todayBtnClass,
  topBarClass,
  weekInfoClass,
  weekLabelTextClass,
  weekRangeTextClass,
} from './MenuBoardDayBar.styles';

const MenuBoardDayBar = () => {
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

  const isCurrentWeek =
    mounted && currentWeek.some((d) => d.isSame(today, 'day'));
  const weekLabel = !mounted
    ? ''
    : isCurrentWeek
      ? '이번주'
      : currentWeek[6].isBefore(today, 'day')
        ? '지난주'
        : '다음주';
  const weekRange = mounted
    ? `${currentWeek[0].format('M.D')} - ${currentWeek[6].format('M.D')}`
    : '';

  return (
    <div className={dayBarContainerClass}>
      <div className={topBarClass}>
        <div suppressHydrationWarning className={weekInfoClass}>
          <span className={weekLabelTextClass}>{weekLabel}</span>
          <span className={weekRangeTextClass}>{weekRange}</span>
        </div>
        <div className={navGroupClass}>
          <button
            type="button"
            onClick={() => {
              if (!canGoPrev) {
                toast('지난주까지만 볼 수 있어요');
                return;
              }
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
              if (!canGoNext) {
                toast('영양사 선생님이 아직 고민 중이에요');
                return;
              }
              sendGAEvent('event', 'week_navigate', { direction: 'next' });
              goToNextWeek();
            }}
            aria-label="다음주 메뉴 보기"
            className={navIconBtnClass(canGoNext)}
          >
            <ChevronRight size={16} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

      <div className={dayGridClass}>
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
              <span className={daySelectionBarClass(isSelected)} />
              <span
                suppressHydrationWarning
                className={dayDowClass(isSelected, isToday, dow)}
              >
                {isToday ? '오늘' : DOW[dow]}
              </span>
              <span
                suppressHydrationWarning
                className={dayDateClass(isSelected, isToday, dow)}
              >
                {day.date()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MenuBoardDayBar;
