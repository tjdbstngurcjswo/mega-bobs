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
  goToToday: () => void;
  refreshToday: () => void;
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
      const { currentWeek, minDate, today } = get();
      const prevWeekStart = currentWeek[0].subtract(7, 'day');
      if (prevWeekStart.isBefore(minDate, 'day')) return;
      const newWeek = getWeekDays(prevWeekStart);
      const hasToday = newWeek.some((d) => d.isSame(today, 'day'));
      set({
        currentWeek: newWeek,
        selectedDate: hasToday ? today : newWeek[0],
      });
    },

    goToNextWeek: () => {
      const { currentWeek, maxDate, today } = get();
      const nextWeekStart = currentWeek[6].add(1, 'day');
      if (nextWeekStart.isAfter(maxDate, 'day')) return;
      const newWeek = getWeekDays(nextWeekStart);
      const hasToday = newWeek.some((d) => d.isSame(today, 'day'));
      set({
        currentWeek: newWeek,
        selectedDate: hasToday ? today : newWeek[0],
      });
    },

    goToToday: () => {
      const freshToday = dayjs().tz();
      set({
        today: freshToday,
        minDate: getWeekDays(freshToday.subtract(1, 'week'))[0],
        maxDate: getWeekDays(freshToday.add(1, 'week'))[6],
        selectedDate: freshToday,
        currentWeek: getWeekDays(freshToday),
      });
    },

    refreshToday: () => {
      const freshToday = dayjs().tz();
      if (freshToday.isSame(get().today, 'day')) return;
      set({
        today: freshToday,
        minDate: getWeekDays(freshToday.subtract(1, 'week'))[0],
        maxDate: getWeekDays(freshToday.add(1, 'week'))[6],
      });
    },
  };
});
