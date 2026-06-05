'use client';

import dayjs from '@/lib/dayjs';
import {useHasMounted} from '@/lib/useHasMounted';
import {cn} from '@/lib/utils';
import {useDateStore} from '@/store/useDateStore';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

const chipBorder = (isSelected: boolean, isToday: boolean) => {
  if (!isSelected) return 'border-line bg-surface';
  return isToday ? 'border-accent bg-accent' : 'border-ink bg-ink';
};

const labelClass = (isSelected: boolean, isToday: boolean, isPast: boolean) => {
  if (isSelected) return isToday ? 'text-ink/55' : 'text-white/60';
  return isPast ? 'text-[#B5B5B2]' : 'text-muted';
};

const dateClass = (isSelected: boolean, isToday: boolean, isPast: boolean) => {
  if (isSelected) return isToday ? 'text-ink' : 'text-white';
  return isPast ? 'text-[#B5B5B2]' : 'text-ink';
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
  const isPast = mounted && day.isBefore(today, 'day');

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-pressed={isSelected}
      className={cn(
        'flex flex-1 cursor-pointer flex-col items-center gap-0.5 border py-1.5',
        chipBorder(isSelected, isToday)
      )}
    >
      <span
        suppressHydrationWarning
        className={cn(
          'text-[10px] font-bold',
          labelClass(isSelected, isToday, isPast)
        )}
      >
        {isToday ? '오늘' : DOW[day.day()]}
      </span>
      <span
        suppressHydrationWarning
        className={cn(
          'text-[13.5px] font-extrabold',
          dateClass(isSelected, isToday, isPast)
        )}
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
    setSelectedDate,
    goToPrevWeek,
    goToNextWeek,
  } = useDateStore();
  const mounted = useHasMounted();

  return (
    <div className="border-line bg-surface flex items-center gap-2 border-b px-5 py-3">
      <button
        type="button"
        onClick={goToPrevWeek}
        aria-label="지난주 메뉴 보기"
        className="border-line text-ink flex h-11 w-7 shrink-0 cursor-pointer items-center justify-center border"
      >
        ‹
      </button>
      <div className="flex flex-1 gap-1.5">
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
      <button
        type="button"
        onClick={goToNextWeek}
        aria-label="다음 주 메뉴 보기"
        className="border-line text-ink flex h-11 w-7 shrink-0 cursor-pointer items-center justify-center border"
      >
        ›
      </button>
    </div>
  );
};

export default DayBar;
