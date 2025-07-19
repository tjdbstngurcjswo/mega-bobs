import {type ClassValue, clsx} from 'clsx';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCalories(calories: number): string {
  return `${calories} kcal`;
}

export function formatYYYYMMDD(date: Date) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function getWeekDays(date: Date): Date[] {
  const d = dayjs(date);
  const day = d.day() === 0 ? 7 : d.day();
  const weekStart = d.subtract(day - 1, 'day').startOf('day');
  return Array.from({length: 7}, (_, i) => weekStart.add(i, 'day').toDate());
}
