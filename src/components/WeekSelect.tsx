'use client';

import {ChevronLeft, ChevronRight} from 'lucide-react';

import {useDateStore} from '@/store/useDateStore';

const WeekSelect = () => {
  const {currentWeek, goToPrevWeek, goToNextWeek} = useDateStore();

  const weekRangeText = `${currentWeek[0].format('M월 D일')} - ${currentWeek[6].format('M월 D일')}`;

  return (
    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
      <button
        onClick={goToPrevWeek}
        className="rounded-lg p-1.5 text-white transition-all hover:scale-110 hover:bg-white/10 sm:p-2"
      >
        <ChevronLeft size={18} className="sm:hidden" />
        <ChevronLeft size={20} className="hidden sm:block" />
      </button>
      <span className="rounded-lg bg-white/10 px-2 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
        {weekRangeText}
      </span>
      <button
        onClick={goToNextWeek}
        className="rounded-lg p-1.5 text-white transition-all hover:scale-110 hover:bg-white/10 sm:p-2"
      >
        <ChevronRight size={18} className="sm:hidden" />
        <ChevronRight size={20} className="hidden sm:block" />
      </button>
    </div>
  );
};

export default WeekSelect;
