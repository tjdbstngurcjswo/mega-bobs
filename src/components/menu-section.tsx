import { MealType } from '@/lib/types'
import { formatCalories } from '@/lib/utils'
import { MenuItem } from './menu-item'
import { Badge } from './ui/badge'

interface MenuSectionProps {
  type: MealType
  items: {
    name: string
    calories: number
    description: string
  }[]
  totalCalories: number
}

const mealTypeToKorean: Record<MealType, string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
}

export function MenuSection({ type, items, totalCalories }: MenuSectionProps) {
  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="bg-accent-blue-light rounded-base p-sm">
            <span className="text-primary-main">{mealTypeToKorean[type]} 식사</span>
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