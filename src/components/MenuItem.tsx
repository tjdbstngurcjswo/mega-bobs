import {formatCalories} from '@/lib/utils';

import {Badge} from './ui/badge';

interface MenuItemProps {
  item: any;
}

const MenuItem = ({item}: MenuItemProps) => {
  return (
    <div className="border-accent-blue-light/50 rounded-base p-md border bg-white/50">
      <div className="flex items-center justify-between">
        <h3 className="text-text-secondary text-md font-medium">{item.name}</h3>
        <Badge variant="blue">{formatCalories(item.calories)}</Badge>
      </div>
      <p className="text-text-tertiary mt-[2.5px] text-base">
        {item.description}
      </p>
    </div>
  );
};

export default MenuItem;
