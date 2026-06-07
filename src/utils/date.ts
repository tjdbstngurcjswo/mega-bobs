import dayjs from '@/lib/dayjs';

export const formatYYYYMMDD = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD');

export const getWeekDays = (date: dayjs.Dayjs): dayjs.Dayjs[] => {
  const day = date.day() === 0 ? 7 : date.day();
  const weekStart = date.subtract(day - 1, 'day').startOf('day');
  return Array.from({length: 7}, (_, i) => weekStart.add(i, 'day'));
};
