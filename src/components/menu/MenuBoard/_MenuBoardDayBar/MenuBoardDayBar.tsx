'use client';

import toast from 'react-hot-toast';

import { useHasMounted } from '@/hooks/useHasMounted';
import { useDateStore } from '@/store/useDateStore';

import MenuBoardDayChip from './MenuBoardDayChip';
import {
  dayBarContainerClass,
  navArrowClass,
  navButtonClass,
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
  } = useDateStore();
  const mounted = useHasMounted();

  const canGoPrev = !mounted || currentWeek[0].isAfter(minDate, 'day');
  const canGoNext = !mounted || currentWeek[6].isBefore(maxDate, 'day');

  const handlePrev = () => {
    if (!canGoPrev) {
      toast.error('지난 주 메뉴는 볼 수 없어요');
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
      <button
        type="button"
        onClick={handlePrev}
        aria-label="지난주 메뉴 보기"
        className={navButtonClass(canGoPrev)}
      >
        <span className={navArrowClass}>‹</span>
      </button>
      <div className="flex flex-1 flex-col">
        <div
          key={currentWeek[0]?.format('YYYY-MM-DD')}
          className="relative flex gap-1.5 overflow-hidden"
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
                className={`pointer-events-none absolute inset-y-0 transition-transform duration-200 ease-out ${isToday ? 'bg-accent' : 'bg-ink'}`}
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
      <button
        type="button"
        onClick={handleNext}
        aria-label="다음 주 메뉴 보기"
        className={navButtonClass(canGoNext)}
      >
        <span className={navArrowClass}>›</span>
      </button>
    </div>
  );
};

export default MenuBoardDayBar;
