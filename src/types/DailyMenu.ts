import type { Database } from '@/types/supabase'

export type DailyMenu = Database['public']['Tables']['daily_menu']['Row']

export type MealType = Database['public']['Tables']['meal_type']['Row']

export type MenuCategory = Database['public']['Tables']['menu_category']['Row']