import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import toast from 'react-hot-toast';

interface WeekNavigatorProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

function getWeekStart(date: Date) {
  const d = dayjs(date);
  const day = d.day() === 0 ? 7 : d.day();
  return d.subtract(day - 1, 'day').startOf('day');
}

const WeekSelect = ({currentDate, onChange}: WeekNavigatorProps) => {
  const weekStart = getWeekStart(currentDate);
  const days = Array.from({length: 7}, (_, i) => weekStart.add(i, 'day'));

  const minDate = dayjs('2025-07-14');
  const maxDate = dayjs('2025-07-20');

  const handlePrevWeek = () => {
    const prevWeekStart = weekStart.subtract(7, 'day');
    if (prevWeekStart.isBefore(minDate, 'day')) {
      toast.error('이전 주의 메뉴 데이터가 없습니다');
      return;
    }
    onChange(prevWeekStart.toDate());
  };
  const handleNextWeek = () => {
    const nextWeekStart = weekStart.add(7, 'day');
    if (nextWeekStart.isAfter(maxDate, 'day')) {
      toast.error('매주 목요일에 메뉴가 업데이트됩니다.');
      return;
    }
    onChange(nextWeekStart.toDate());
  };

  const weekRange = `${days[0].format('M월 D일')} - ${days[6].format('M월 D일')}`;

  return (
    <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 p-3 text-white sm:gap-4 sm:p-4">
      <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
        <button
          onClick={handlePrevWeek}
          className="rounded-lg p-1.5 text-white transition-all hover:scale-110 hover:bg-white/10 sm:p-2"
        >
          <ChevronLeft size={18} className="sm:hidden" />
          <ChevronLeft size={20} className="hidden sm:block" />
        </button>
        <span className="rounded-lg bg-white/10 px-2 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
          {weekRange}
        </span>
        <button
          onClick={handleNextWeek}
          className="rounded-lg p-1.5 text-white transition-all hover:scale-110 hover:bg-white/10 sm:p-2"
        >
          <ChevronRight size={18} className="sm:hidden" />
          <ChevronRight size={20} className="hidden sm:block" />
        </button>
      </div>
      <div className="flex w-full justify-between gap-0.5 px-1 sm:gap-1 sm:px-2">
        {days.map((d) => {
          const isSelected = d.isSame(dayjs(currentDate), 'day');
          const isDisabled =
            d.isBefore(minDate, 'day') || d.isAfter(maxDate, 'day');
          return (
            <DayButton
              key={d.format('YYYY-MM-DD')}
              day={d}
              isSelected={isSelected}
              isDisabled={isDisabled}
              onClick={() => onChange(d.toDate())}
            />
          );
        })}
      </div>
    </div>
  );
};

const DayButton = ({
  day,
  isSelected,
  isDisabled,
  onClick,
}: {
  day: dayjs.Dayjs;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) => {
  const getTextColorClass = (day: dayjs.Dayjs, isSelected: boolean) => {
    const dayOfWeek = day.day();

    if (isSelected) {
      if (dayOfWeek === 0) {
        return 'text-red-600';
      } else if (dayOfWeek === 6) {
        return 'text-blue-600';
      }
      return 'text-slate-800';
    }

    if (dayOfWeek === 0) {
      return 'text-red-300';
    } else if (dayOfWeek === 6) {
      return 'text-blue-300';
    }

    return 'text-white';
  };
  return (
    <button
      key={day.format('YYYY-MM-DD')}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isSelected ? `bg-white ${getTextColorClass(day, isSelected)}` : `${getTextColorClass(day, isSelected)} hover:bg-white/20`} ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="flex flex-col items-center">
        <div className="text-xs">{day.locale('ko').format('dd')}</div>
        <div className="text-sm">{day.format('D')}</div>
      </div>
    </button>
  );
};

export default WeekSelect;
