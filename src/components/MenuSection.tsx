import {CategoryEnum, MenuItemType} from '@/types/MenuType';

import MenuItem from './MenuItem';

interface MenuSectionProps {
  type: CategoryEnum;
  items: MenuItemType[];
}

const MenuSection = ({type, items}: MenuSectionProps) => (
  <div className="flex h-full flex-col rounded-xl bg-white shadow-lg drop-shadow-2xl">
    <div className="z-1 flex items-center justify-between rounded-t-xl bg-slate-100 px-8 py-4 shadow-md">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-slate-800">{type}</h2>
        </div>
      </div>
      <div className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
        {items?.reduce((sum, item) => sum + item.kcal, 0) || 0} kcal
      </div>
    </div>
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {items?.map((item) => (
        <MenuItem key={item.name} item={item} />
      ))}
    </div>
  </div>
);

export default MenuSection;
