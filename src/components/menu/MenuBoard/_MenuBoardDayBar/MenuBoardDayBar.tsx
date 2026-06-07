'use client';

import { useRef } from 'react';
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
  const directionRef = useRef<'prev' | 'next'>('next');

  const canGoPrev = !mounted || currentWeek[0].isAfter(minDate, 'day');
  const canGoNext = !mounted || currentWeek[6].isBefore(maxDate, 'day');

  const handlePrev = () => {
    if (!canGoPrev) {
      toast.error('지난 메뉴는 볼 수 없습니다.');
      return;
    }
    directionRef.current = 'prev';
    goToPrevWeek();
  };

  const handleNext = () => {
    if (!canGoNext) {
      toast.error('매주 목요일에 업데이트됩니다.');
      return;
    }
    directionRef.current = 'next';
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
          className="flex gap-1.5 overflow-hidden"
          style={{
            animation: `${directionRef.current === 'next' ? 'slideFromRight' : 'slideFromLeft'} 0.22s ease both`,
          }}
        >
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
