import { create } from 'zustand';

import dayjs from '@/lib/dayjs';
import { getWeekDays } from '@/utils/date';

interface DateStore {
  today: dayjs.Dayjs;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  selectedDate: dayjs.Dayjs;
  currentWeek: dayjs.Dayjs[];
  setSelectedDate: (date: dayjs.Dayjs) => void;
  initFromDate: (date: dayjs.Dayjs) => void;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
}

export const useDateStore = create<DateStore>((set, get) => {
  const today = dayjs().tz();
  const minDate = getWeekDays(today.subtract(1, 'week'))[0];
  const maxDate = getWeekDays(today.add(1, 'week'))[6];

  return {
    today,
    minDate,
    maxDate,
    selectedDate: today,
    currentWeek: getWeekDays(today),

    setSelectedDate: (date) => set({ selectedDate: date }),

    initFromDate: (date) =>
      set({ selectedDate: date, currentWeek: getWeekDays(date) }),

    goToPrevWeek: () => {
      const { currentWeek, minDate } = get();
      const prevWeekStart = currentWeek[0].subtract(7, 'day');
      if (prevWeekStart.isBefore(minDate, 'day')) return;
      set({ currentWeek: getWeekDays(prevWeekStart) });
    },

    goToNextWeek: () => {
      const { currentWeek, maxDate } = get();
      const nextWeekStart = currentWeek[6].add(1, 'day');
      if (nextWeekStart.isAfter(maxDate, 'day')) return;
      set({ currentWeek: getWeekDays(nextWeekStart) });
    },
  };
});
