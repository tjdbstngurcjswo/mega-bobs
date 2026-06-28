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

const computeDateWindow = (t: dayjs.Dayjs) => ({
  minDate: getWeekDays(t.subtract(1, 'week'))[0],
  maxDate: getWeekDays(t.add(1, 'week'))[6],
});

export const useDateStore = create<DateStore>((set, get) => {
  const today = dayjs().tz();
  const { minDate, maxDate } = computeDateWindow(today);

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
        ...computeDateWindow(freshToday),
        selectedDate: freshToday,
        currentWeek: getWeekDays(freshToday),
      });
    },

    refreshToday: () => {
      const freshToday = dayjs().tz();
      const { today, selectedDate } = get();
      if (freshToday.isSame(today, 'day')) return;
      const wasOnToday = selectedDate.isSame(today, 'day');
      set({
        today: freshToday,
        ...computeDateWindow(freshToday),
        ...(wasOnToday
          ? { selectedDate: freshToday, currentWeek: getWeekDays(freshToday) }
          : {}),
      });
    },
  };
});
