import dayjs from '@/lib/dayjs';

export function formatCalories(calories: number): string {
  return `${calories} kcal`;
}

export function formatYYYYMMDD(date: dayjs.Dayjs) {
  return date.format('YYYY-MM-DD');
}

export function getWeekDays(date: dayjs.Dayjs): dayjs.Dayjs[] {
  const day = date.day() === 0 ? 7 : date.day();
  const weekStart = date.subtract(day - 1, 'day').startOf('day');
  return Array.from({length: 7}, (_, i) => weekStart.add(i, 'day'));
}
