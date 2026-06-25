'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { useEffect } from 'react';

import { useHasMounted } from '@/hooks/useHasMounted';
import { useDateStore } from '@/store/useDateStore';

import {
  chipAreaClass,
  chipRowClass,
  dayBarContainerClass,
  indicatorClass,
  navArrowClass,
  navButtonClass,
  navTooltipClass,
  weekLabelClass,
  weekRangeClass,
} from './MenuBoardDayBar.styles';
import MenuBoardDayChip from './MenuBoardDayChip';

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
  const prevLabel = isCurrentWeek ? '지난주' : '이번주';
  const nextLabel = isCurrentWeek ? '다음주' : '이번주';

  return (
    <div className={dayBarContainerClass}>
      <div className={weekLabelClass}>
        <button
          type="button"
          onClick={() => {
            sendGAEvent('event', 'week_navigate', { direction: 'prev' });
            goToPrevWeek();
          }}
          aria-label="지난주 메뉴 보기"
          className={navButtonClass(canGoPrev)}
        >
          <span className={navArrowClass}>‹</span>
          <span className={navTooltipClass}>{prevLabel}</span>
        </button>
        <span suppressHydrationWarning className={weekRangeClass}>
          {weekLabel}
        </span>
        <button
          type="button"
          onClick={() => {
            sendGAEvent('event', 'week_navigate', { direction: 'next' });
            goToNextWeek();
          }}
          aria-label="다음 주 메뉴 보기"
          className={navButtonClass(canGoNext)}
        >
          <span className={navArrowClass}>›</span>
          <span className={navTooltipClass}>{nextLabel}</span>
        </button>
      </div>
      <div className={chipAreaClass}>
        <div
          key={currentWeek[0]?.format('YYYY-MM-DD')}
          className={chipRowClass}
          style={{ animation: 'fadeIn 0.2s ease both' }}
        >
          {(() => {
            const idx = mounted
              ? currentWeek.findIndex((d) => d.isSame(selectedDate, 'day'))
              : -1;
            const isToday = mounted && selectedDate.isSame(today, 'day');
            return idx >= 0 ? (
              <div
                aria-hidden
                className={indicatorClass(isToday)}
                style={{
                  width: 'calc((100% - 36px) / 7)',
                  transform: `translateX(calc(${idx} * (100% + 6px)))`,
                }}
              />
            ) : null;
          })()}
          {currentWeek.map((day) => (
            <MenuBoardDayChip
              key={day.format('YYYY-MM-DD')}
              day={day}
              today={today}
              selectedDate={selectedDate}
              onSelect={(d) => {
                sendGAEvent('event', 'day_select', {
                  offset: d.diff(today, 'day'),
                });
                setSelectedDate(d);
              }}
              mounted={mounted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuBoardDayBar;
