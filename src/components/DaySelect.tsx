import dayjs from 'dayjs';
import 'dayjs/locale/ko';

interface WeekNavigatorProps {
  date: Date;
  week: Date[];
  onChange: (date: Date) => void;
}

const DaySelect = ({date, week, onChange}: WeekNavigatorProps) => {
  const minDate = dayjs('2025-07-14');
  const maxDate = dayjs('2025-07-20');
  return (
    <div className="flex w-full justify-between gap-0.5 px-1 sm:gap-1 sm:px-2">
      {week.map((d) => {
        const isSelected = dayjs(d).isSame(dayjs(date), 'day');
        const isDisabled =
          dayjs(d).isBefore(minDate, 'day') || dayjs(d).isAfter(maxDate, 'day');
        return (
          <DayButton
            key={dayjs(d).format('YYYY-MM-DD')}
            day={dayjs(d)}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onClick={() => onChange(dayjs(d).toDate())}
          />
        );
      })}
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
  const isToday = day.isSame(dayjs(), 'day');

  const getTextColorClass = (day: dayjs.Dayjs, isSelected: boolean) => {
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
      key={day.format('YYYY-MM-DD')}
      className={`relative rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isSelected ? `bg-white dark:bg-[#23242B] ${getTextColorClass(day, isSelected)}` : `${getTextColorClass(day, isSelected)} hover:bg-white/20`} ${isDisabled ? 'cursor-not-allowed opacity-40' : ''} ${isToday ? 'outline-1 outline-offset-2 outline-orange-200' : ''}`}
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

export default DaySelect;
