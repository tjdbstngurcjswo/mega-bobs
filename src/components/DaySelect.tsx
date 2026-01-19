import type {Dayjs} from 'dayjs';

import dayjs, {SEOUL_TIMEZONE} from '@/lib/dayjs';

interface WeekNavigatorProps {
  date: Date;
  week: Date[];
  onChange: (date: Date) => void;
}

const DaySelect = ({date, week, onChange}: WeekNavigatorProps) => {
  const today = dayjs.tz(new Date(), SEOUL_TIMEZONE).toDate();
  return (
    <div className="flex w-full justify-between gap-1 p-2">
      {week.map((d) => {
        const dayInstance = dayjs(d);
        return (
          <DayButton
            key={dayInstance.format('YYYY-MM-DD')}
            day={dayInstance}
            onClick={() => onChange(dayInstance.toDate())}
            isSelected={dayInstance.isSame(date, 'day')}
            isToday={dayInstance.isSame(today, 'day')}
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
  isToday,
}: {
  day: Dayjs;
  isSelected: boolean;
  onClick: () => void;
  isToday: boolean;
}) => {
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
