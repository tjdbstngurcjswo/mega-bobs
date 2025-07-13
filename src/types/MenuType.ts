import type {Database} from '@/types/supabase';

export type MenuType = Database['public']['Tables']['daily_menu']['Row'];

export type MenuItemType = {
  name: string;
  kcal: number;
};

export type MealEnum = Database['public']['Enums']['meal'];

export type CategoryEnum = Database['public']['Enums']['category'];
