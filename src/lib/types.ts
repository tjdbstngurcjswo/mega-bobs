export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface MenuItem {
  name: string
  calories: number
  description: string
}

export interface DailyMenu {
  date: string
  meals: {
    [key in MealType]: {
      totalCalories: number
      items: MenuItem[]
    }
  }
}

export interface WeeklyMenu {
  startDate: string
  endDate: string
  menus: DailyMenu[]
} 