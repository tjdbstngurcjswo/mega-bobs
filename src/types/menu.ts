import {MealType} from './meal';

export type MenuItemType = {
  name: string;
  kcal: number;
};

export type MenuType = {
  category: MenuCategory;
  date: string;
  items: MenuItemType[];
  meal: MealType;
};
export type MenuCategory = 'COURSE_1' | 'COURSE_2' | 'TAKE_OUT';
