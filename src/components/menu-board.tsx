import { MealType } from '@/lib/types'
import { MenuSection } from './menu-section'
import { Tab, Tabs } from './ui/tabs'

interface MenuBoardProps {
  selectedMeal: MealType
  onMealSelect: (meal: MealType) => void
  menuItems: {
    name: string
    calories: number
    description: string
  }[]
}

const mealTypeToKorean: Record<MealType, string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']

export function MenuBoard({ selectedMeal, onMealSelect, menuItems }: MenuBoardProps) {
  const totalCalories = menuItems.reduce((sum, item) => sum + item.calories, 0)

  return (
    <div className="px-lg pt-lg">
      <Tabs>
        {MEAL_TYPES.map((type) => (
          <Tab
            key={type}
            isActive={type === selectedMeal}
            onClick={() => onMealSelect(type)}
          >
            {mealTypeToKorean[type]}
          </Tab>
        ))}
      </Tabs>

      <div className="mt-lg">
        <MenuSection
          type={selectedMeal}
          items={menuItems}
          totalCalories={totalCalories}
        />
      </div>
    </div>
  )
} 