import {MenuCategory} from '@/types/menu';

export const DEFAULT_MENU_CATEGORY: MenuCategory = 'COURSE_1';

export const MENU_CATEGORIES: MenuCategory[] = [
  'COURSE_1',
  'COURSE_2',
  'TAKE_OUT',
] as const;

export const MenuCategoryLabel: Record<MenuCategory, {ko: string; en: string}> =
  {
    COURSE_1: {
      ko: '코스1',
      en: 'Course 1',
    },
    COURSE_2: {
      ko: '코스2',
      en: 'Course 2',
    },
    TAKE_OUT: {
      ko: '테이크아웃',
      en: 'Take Out',
    },
  } as const;
