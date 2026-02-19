'use client';

import type {Dayjs} from 'dayjs';

import {useDateStore} from '@/store/useDateStore';

const DaySelect = () => {
  const {today, currentWeek, selectedDate, setSelectedDate} = useDateStore();

  return (
    <div className="flex w-full justify-between gap-1 p-2">
      {currentWeek.map((day) => (
        <DayButton
          key={day.format('YYYY-MM-DD')}
          day={day}
          onClick={() => setSelectedDate(day)}
          isSelected={day.isSame(selectedDate, 'day')}
          isToday={day.isSame(today, 'day')}
        />
      ))}
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
      className={`relative rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isSelected ? `bg-white dark:bg-dark-muted ${getTextColorClass(day, isSelected)}` : `${getTextColorClass(day, isSelected)} hover:bg-white/20`} ${isToday ? 'outline-1 outline-offset-2 outline-orange-200' : ''}`}
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
