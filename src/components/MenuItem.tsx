
import {formatCalories} from '@/lib/utils';

import {Badge} from './ui/badge';

interface MenuItemProps {
  item: any;
}

const MenuItem = ({item}: MenuItemProps) => {
  return (
    <div className="bg-white/50 border border-accent-blue-light/50 rounded-base p-md">
      <div className="flex items-center justify-between">
        <h3 className="text-text-secondary text-md font-medium">{item.name}</h3>
        <Badge variant="blue">{formatCalories(item.calories)}</Badge>
      </div>
      <p className="text-text-tertiary text-base mt-[2.5px]">{item.description}</p>
    </div>
  )
} 

export default MenuItem;