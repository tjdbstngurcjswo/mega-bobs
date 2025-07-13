
import {MealType} from '@/types/DailyMenu'

import MenuSection from './MenuSection'
import {Tab, Tabs} from './ui/tabs'

interface MenuBoardProps {
  selectedMeal: MealType
  onMealSelect: (meal: MealType) => void
  menuItems: {
    name: string
    calories: number
    description: string
  }[]
}

const MEAL_TYPES: MealType[] = [{id:1, name:'아침'}, {id:2, name:'점심'}, {id:3, name:'저녁'}]

const MenuBoard = ({selectedMeal, onMealSelect, menuItems}: MenuBoardProps) => {
  const totalCalories = menuItems.reduce((sum, item) => sum + item.calories, 0)

  return (
    <div className="px-lg pt-lg">
      <Tabs>
        {MEAL_TYPES.map((type) => (
          <Tab
            key={type.id}
            isActive={type === selectedMeal}
            onClick={() => onMealSelect(type)}
          >
            {type.name}
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

export default MenuBoard