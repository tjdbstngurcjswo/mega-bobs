import {formatCalories} from '@/lib/utils';
import {MenuItemType} from '@/types/MenuType';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem = ({item}: MenuItemProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-slate-800">{item.name}</h3>
        <div className="ml-4 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {formatCalories(item.kcal)}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
