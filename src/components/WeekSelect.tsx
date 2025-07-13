import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {ChevronLeft, ChevronRight} from 'lucide-react';

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

  const handlePrevWeek = () => {
    onChange(weekStart.subtract(7, 'day').toDate());
  };
  const handleNextWeek = () => {
    onChange(weekStart.add(7, 'day').toDate());
  };

  const weekRange = `${days[0].format('M월 D일')} - ${days[6].format('M월 D일')}`;

  const getTextColorClass = (day: dayjs.Dayjs, isSelected: boolean) => {
    const dayOfWeek = day.day();

    if (isSelected) {
      if (dayOfWeek === 0) {
        return 'text-red-400';
      } else if (dayOfWeek === 6) {
        return 'text-blue-400';
      }
      return 'text-slate-800';
    }

    if (dayOfWeek === 0) {
      return 'text-red-400';
    } else if (dayOfWeek === 6) {
      return 'text-blue-400';
    }

    return 'text-white';
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-800 p-4 text-white">
      <div className="flex w-full items-center justify-between gap-4">
        <button
          onClick={handlePrevWeek}
          className="rounded-md p-2 text-white transition-colors hover:bg-white/20"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="rounded-lg bg-white/10 px-3 py-1 text-base text-white">
          {weekRange}
        </span>
        <button
          onClick={handleNextWeek}
          className="rounded-md p-2 text-white transition-colors hover:bg-white/20"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="flex w-full justify-between gap-1 px-4">
        {days.map((d) => {
          const isSelected = d.isSame(dayjs(currentDate), 'day');

          return (
            <button
              key={d.format('YYYY-MM-DD')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? `bg-white ${getTextColorClass(d, isSelected)}`
                  : `${getTextColorClass(d, isSelected)} hover:bg-white/20`
              }`}
              onClick={() => onChange(d.toDate())}
            >
              <div className="flex flex-col items-center">
                <div className="text-xs">{d.locale('ko').format('dd')}</div>
                <div className="text-sm">{d.format('D')}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekSelect;
