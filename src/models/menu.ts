/** 식사 시간대 */
type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

/** 코스 카테고리 */
export type MenuCategory = 'COURSE_1' | 'COURSE_2' | 'TAKE_OUT';

/** 단일 메뉴 아이템 */
type MenuItemType = {
  name: string;
  /** 칼로리 (kcal) */
  kcal: number;
};

/** Supabase `daily_menu` 행 */
export type MenuType = {
  category: MenuCategory;
  /** YYYY-MM-DD */
  date: string;
  items: MenuItemType[];
  meal: MealType;
};
