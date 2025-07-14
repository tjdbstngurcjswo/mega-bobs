import {formatCalories} from '@/lib/utils';
import {MenuItemType} from '@/types/MenuType';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem = ({item}: MenuItemProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800 sm:text-base">
          {item.name}
        </h3>
        <div className="ml-2 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 sm:ml-4 sm:px-3 sm:text-sm">
          {formatCalories(item.kcal)}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
