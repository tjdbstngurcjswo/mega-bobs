
import {formatCalories} from '@/lib/utils'
import {MealType} from '@/types/DailyMenu'

import MenuItem from './MenuItem'
import {Badge} from './ui/badge'

interface MenuSectionProps {
  type: MealType
  items: {
    name: string
    calories: number
    description: string
  }[]
  totalCalories: number
}

const MenuSection = ({type, items, totalCalories}: MenuSectionProps) => {
  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="bg-accent-blue-light rounded-base p-sm">
            <span className="text-primary-main">{type.name} 식사</span>
          </div>
          <Badge variant="blue">{formatCalories(totalCalories)}</Badge>
        </div>
      </div>
      <div className="space-y-sm">
        {items.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  )
} 

export default MenuSection;