import type {Dayjs} from 'dayjs';

import {useToday} from '@/contexts/DateContext';
import dayjs from '@/lib/dayjs';

interface WeekNavigatorProps {
  date: Date;
  week: Date[];
  onChange: (date: Date) => void;
}

const DaySelect = ({date, week, onChange}: WeekNavigatorProps) => {
  const today = useToday();

  return (
    <div className="flex w-full justify-between gap-0.5 px-1 sm:gap-1 sm:px-2">
      {week.map((d) => {
        const dayInstance = dayjs(d);
        const isSelected = dayInstance.isSame(dayjs(date), 'day');
        return (
          <DayButton
            key={dayInstance.format('YYYY-MM-DD')}
            day={dayInstance}
            isSelected={isSelected}
            onClick={() => onChange(dayInstance.toDate())}
            today={today}
          />
        );
      })}
    </div>
  );
};

const DayButton = ({
  day,
  isSelected,
  onClick,
  today,
}: {
  day: Dayjs;
  isSelected: boolean;
  onClick: () => void;
  today: Date;
}) => {
  const isToday = day.isSame(dayjs(today), 'day');

  const getTextColorClass = (day: Dayjs, isSelected: boolean) => {
    const dayOfWeek = day.day();

    if (isSelected) {
      if (dayOfWeek === 0) return 'text-red-600';
      else if (dayOfWeek === 6) return 'text-blue-600';

      return 'text-slate-800 dark:text-white';
    }

    if (dayOfWeek === 0) return 'text-red-300';
    else if (dayOfWeek === 6) return 'text-blue-300';

    return 'text-white';
  };
  return (
    <button
      type="button"
      className={`relative rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isSelected ? `bg-white dark:bg-[#808391] ${getTextColorClass(day, isSelected)}` : `${getTextColorClass(day, isSelected)} hover:bg-white/20`} ${isToday ? 'outline-1 outline-offset-2 outline-orange-200' : ''}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="text-xs">{day.locale('ko').format('dd')}</div>
        <div className="text-sm">{day.format('D')}</div>
      </div>
    </button>
  );
};

export default DaySelect;
