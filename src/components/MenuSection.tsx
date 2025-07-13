import {CategoryEnum, MenuItemType} from '@/types/MenuType';

import MenuItem from './MenuItem';

interface MenuSectionProps {
  type: CategoryEnum;
  items: MenuItemType[];
}

const MenuSection = ({type, items}: MenuSectionProps) => (
  <div className="space-y-md">
    <div className="flex items-center justify-between">
      <div className="gap-sm flex items-center">
        <div className="bg-accent-blue-light rounded-base p-sm">
          <span className="text-primary-main">{type}</span>
        </div>
      </div>
    </div>
    <div className="space-y-sm">
      {items?.map((item) => (
        <MenuItem key={item.name} item={item} />
      ))}
    </div>
  </div>
);

export default MenuSection;
