export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type MenuCategory = 'COURSE_1' | 'COURSE_2' | 'TAKE_OUT';

type MenuItemType = {
  name: string;
  kcal: number;
};

export type MenuType = {
  category: MenuCategory;
  date: string;
  items: MenuItemType[];
  meal: MealType;
};
