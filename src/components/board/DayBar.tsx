'use client';

import {useRef} from 'react';

import dayjs from '@/lib/dayjs';
import {useHasMounted} from '@/lib/useHasMounted';
import {cn} from '@/lib/utils';
import {useDateStore} from '@/store/useDateStore';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

const chipBg = (isSelected: boolean, isToday: boolean) => {
  if (!isSelected) return 'bg-transparent hover:bg-surface-warm';
  return isToday ? 'bg-accent' : 'bg-ink';
};

const dowColor = (dow: number) => {
  if (dow === 0) return 'text-red-500';
  if (dow === 6) return 'text-blue-500';
  return null;
};

const labelClass = (isSelected: boolean, isToday: boolean, dow: number) => {
  if (isSelected) return isToday ? 'text-ink/55' : 'text-white/60';
  return dowColor(dow) ?? 'text-muted';
};

const dateClass = (isSelected: boolean, isToday: boolean, dow: number) => {
  if (isSelected) return isToday ? 'text-ink' : 'text-white';
  return dowColor(dow) ?? 'text-ink';
};

interface DayChipProps {
  day: dayjs.Dayjs;
  today: dayjs.Dayjs;
  selectedDate: dayjs.Dayjs;
  onSelect: (day: dayjs.Dayjs) => void;
  /** 마운트 전(=SSR/정적 HTML)에는 강조를 적용하지 않아 stale '오늘' 점프를 막는다 */
  mounted: boolean;
}

const DayChip = ({day, today, selectedDate, onSelect, mounted}: DayChipProps) => {
  const isToday = mounted && day.isSame(today, 'day');
  const isSelected = mounted && day.isSame(selectedDate, 'day');

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-pressed={isSelected}
      className={cn(
        'flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-1.5 transition-colors duration-150',
        chipBg(isSelected, isToday)
      )}
    >
      <span
        suppressHydrationWarning
        className={cn('text-[10px] font-bold', labelClass(isSelected, isToday, day.day()))}
      >
        {isToday ? '오늘' : DOW[day.day()]}
      </span>
      <span
        suppressHydrationWarning
        className={cn('text-[13.5px] font-extrabold', dateClass(isSelected, isToday, day.day()))}
      >
        {day.date()}
      </span>
    </button>
  );
};

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
        className={cn(
          'flex w-8 shrink-0 cursor-pointer flex-col items-center gap-0.5 transition-opacity duration-100 active:scale-75',
          canGoPrev ? 'text-muted hover:text-ink' : 'cursor-default opacity-25'
        )}
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
        className={cn(
          'flex w-8 shrink-0 cursor-pointer flex-col items-center gap-0.5 transition-opacity duration-100 active:scale-75',
          canGoNext ? 'text-muted hover:text-ink' : 'cursor-default opacity-25'
        )}
      >
        <span className="text-[16px] font-light leading-none">›</span>
      </button>
    </div>
  );
};

export default DayBar;
