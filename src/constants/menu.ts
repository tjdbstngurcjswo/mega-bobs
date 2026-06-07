import {MenuCategory} from '@/types/menu';
import {PickType} from '@/types/vote';

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

export const CATEGORY_TO_PICK: Partial<Record<MenuCategory, PickType>> = {
  COURSE_1: 'A',
  COURSE_2: 'B',
  TAKE_OUT: 'takeout',
};

export const PICKS: {type: PickType; label: string}[] = [
  {type: 'A', label: 'A코스'},
  {type: 'B', label: 'B코스'},
  {type: 'takeout', label: '테이크아웃'},
  {type: 'pass', label: '패스'},
];
