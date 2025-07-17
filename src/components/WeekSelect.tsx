import {getWeekRange} from '@/lib/utils';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import toast from 'react-hot-toast';

interface WeekNavigatorProps {
  week: Date[];
  onChange: (date: Date[]) => void;
}

const WeekSelect = ({week, onChange}: WeekNavigatorProps) => {
  const weekStart = dayjs(week[0]);
  const days = Array.from({length: 7}, (_, i) => weekStart.add(i, 'day'));

  const minDate = dayjs().startOf('week').add(1, 'day');
  const maxDate = dayjs().add(1, 'week').endOf('week').add(1, 'day');

  const handlePrevWeek = () => {
    const prevWeekStart = weekStart.subtract(7, 'day');
    if (prevWeekStart.isBefore(minDate, 'day')) {
      toast.error('지난 메뉴는 볼 수 없습니다.');
      return;
    }
    onChange(getWeekRange(prevWeekStart.toDate()));
  };
  const handleNextWeek = () => {
    const nextWeekStart = weekStart.add(7, 'day');
    if (nextWeekStart.isAfter(maxDate, 'day')) {
      toast.error('매주 목요일에 업데이트됩니다.');
      return;
    }
    onChange(getWeekRange(nextWeekStart.toDate()));
  };

  const weekRangeText = `${days[0].format('M월 D일')} - ${days[6].format('M월 D일')}`;

  return (
    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
      <button
        onClick={handlePrevWeek}
        className="rounded-lg p-1.5 text-white transition-all hover:scale-110 hover:bg-white/10 sm:p-2"
      >
        <ChevronLeft size={18} className="sm:hidden" />
        <ChevronLeft size={20} className="hidden sm:block" />
      </button>
      <span className="rounded-lg bg-white/10 px-2 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
        {weekRangeText}
      </span>
      <button
        onClick={handleNextWeek}
        className="rounded-lg p-1.5 text-white transition-all hover:scale-110 hover:bg-white/10 sm:p-2"
      >
        <ChevronRight size={18} className="sm:hidden" />
        <ChevronRight size={20} className="hidden sm:block" />
      </button>
    </div>
  );
};

export default WeekSelect;
