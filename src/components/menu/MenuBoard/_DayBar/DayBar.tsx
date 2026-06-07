'use client';

import {useRef} from 'react';

import {useHasMounted} from '@/hooks/useHasMounted';
import {useDateStore} from '@/store/useDateStore';

import DayChip from './DayChip';
import {navButtonClass} from './DayBar.styles';

const DayBar = () => {
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
    directionRef.current = 'prev';
    goToPrevWeek();
  };

  const handleNext = () => {
    directionRef.current = 'next';
    goToNextWeek();
  };

  return (
    <div className="bg-surface flex items-center gap-2 px-4 py-3">
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="지난주 메뉴 보기"
        className={navButtonClass(canGoPrev)}
      >
        <span className="text-[16px] font-light leading-none">‹</span>
      </button>
      <div className="flex flex-1 flex-col">
        <div
          key={currentWeek[0]?.format('YYYY-MM-DD')}
          className="flex gap-1.5 overflow-hidden"
          style={{animation: `${directionRef.current === 'next' ? 'slideFromRight' : 'slideFromLeft'} 0.22s ease both`}}
        >
          {currentWeek.map((day) => (
            <DayChip
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
        disabled={!canGoNext}
        aria-label="다음 주 메뉴 보기"
        className={navButtonClass(canGoNext)}
      >
        <span className="text-[16px] font-light leading-none">›</span>
      </button>
    </div>
  );
};

export default DayBar;
