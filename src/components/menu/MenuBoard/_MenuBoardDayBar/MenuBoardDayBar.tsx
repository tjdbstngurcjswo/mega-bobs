'use client';

import toast from 'react-hot-toast';

import { useHasMounted } from '@/hooks/useHasMounted';
import { useDateStore } from '@/store/useDateStore';

import {
  chipAreaClass,
  chipRowClass,
  dayBarContainerClass,
  indicatorClass,
  navArrowClass,
  navButtonClass,
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
  } = useDateStore();
  const mounted = useHasMounted();

  const canGoPrev = !mounted || currentWeek[0].isAfter(minDate, 'day');
  const canGoNext = !mounted || currentWeek[6].isBefore(maxDate, 'day');

  const handlePrev = () => {
    if (!canGoPrev) {
      toast.error('제공하지 않는 날짜예요');
      return;
    }
    goToPrevWeek();
  };

  const handleNext = () => {
    if (!canGoNext) {
      toast.error('아직 준비 중이에요');
      return;
    }
    goToNextWeek();
  };

  return (
    <div className={dayBarContainerClass}>
      <div className={weekLabelClass}>
        <button
          type="button"
          onClick={handlePrev}
          aria-label="지난주 메뉴 보기"
          className={navButtonClass(canGoPrev)}
        >
          <span className={navArrowClass}>‹</span>
        </button>
        <span suppressHydrationWarning className={weekRangeClass}>
          {mounted
            ? `${currentWeek[0].format('M월 D일')} - ${currentWeek[6].format('M월 D일')}`
            : ''}
        </span>
        <button
          type="button"
          onClick={handleNext}
          aria-label="다음 주 메뉴 보기"
          className={navButtonClass(canGoNext)}
        >
          <span className={navArrowClass}>›</span>
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
              onSelect={setSelectedDate}
              mounted={mounted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuBoardDayBar;
