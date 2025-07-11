import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatCalories(calories: number): string {
  return `${calories} kcal`
}

export function getDayOfWeek(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    weekday: 'short',
  }).format(date)
} 