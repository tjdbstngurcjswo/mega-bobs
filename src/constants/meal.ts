import {MealType} from '@/types/meal';

export const MealTypeLabelMap: Record<MealType, {ko: string; en: string}> = {
  BREAKFAST: {
    ko: '아침',
    en: 'Breakfast',
  },
  LUNCH: {
    ko: '점심',
    en: 'Lunch',
  },
  DINNER: {
    ko: '저녁',
    en: 'Dinner',
  },
} as const;
