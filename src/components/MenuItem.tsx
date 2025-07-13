import {formatCalories} from '@/lib/utils';
import {MenuItemType} from '@/types/MenuType';

import {Badge} from './ui/badge';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem = ({item}: MenuItemProps) => {
  return (
    <div className="border-accent-blue-light/50 rounded-base p-md border bg-white/50">
      <div className="flex items-center justify-between">
        <h3 className="text-text-secondary text-md font-medium">{item.name}</h3>
        <Badge variant="blue">{formatCalories(item.kcal)}</Badge>
      </div>
    </div>
  );
};

export default MenuItem;
