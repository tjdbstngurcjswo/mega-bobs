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
