import toast from 'react-hot-toast';
import {create} from 'zustand';

import dayjs from '@/lib/dayjs';
import {getWeekDays} from '@/lib/utils';

interface DateStore {
  today: dayjs.Dayjs;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  selectedDate: dayjs.Dayjs;
  currentWeek: dayjs.Dayjs[];
  setSelectedDate: (date: dayjs.Dayjs) => void;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
}

const today = dayjs().tz();
const minDate = getWeekDays(today.subtract(1, 'week'))[0];
const maxDate = getWeekDays(today.add(1, 'week'))[6];

export const useDateStore = create<DateStore>((set, get) => ({
  today,
  minDate,
  maxDate,
  selectedDate: today,
  currentWeek: getWeekDays(today),

  setSelectedDate: (date) => set({selectedDate: date}),

  goToPrevWeek: () => {
    const {currentWeek, minDate} = get();
    const prevWeekStart = currentWeek[0].subtract(7, 'day');
    if (prevWeekStart.isBefore(minDate, 'day')) {
      toast.error('지난 메뉴는 볼 수 없습니다.');
      return;
    }
    set({currentWeek: getWeekDays(prevWeekStart)});
  },

  goToNextWeek: () => {
    const {currentWeek, maxDate} = get();
    const nextWeekStart = currentWeek[6].add(1, 'day');
    if (nextWeekStart.isAfter(maxDate, 'day')) {
      toast.error('매주 목요일에 업데이트됩니다.');
      return;
    }
    set({currentWeek: getWeekDays(nextWeekStart)});
  },
}));
