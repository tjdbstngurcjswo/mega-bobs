import {menuCategoryLabelMap} from '@/constants/menuCategory';
import {CategoryEnum, MenuItemType} from '@/types/MenuType';

import MenuItem from './MenuItem';

interface MenuSectionProps {
  type: CategoryEnum;
  items?: MenuItemType[];
  isLoading?: boolean;
}

const MenuSection = ({type, items, isLoading}: MenuSectionProps) => {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                {menuCategoryLabelMap[type].ko}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-300 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-sm text-gray-500">메뉴를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items && items.length > 0) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                {menuCategoryLabelMap[type].ko}
              </h2>
            </div>
          </div>
          <div className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 sm:px-3 sm:text-sm">
            {items.reduce((sum, item) => sum + item.kcal, 0)} kcal
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3 sm:space-y-3 sm:p-4">
          {items.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-white shadow-lg">
      <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
              {menuCategoryLabelMap[type].ko}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-3 text-2xl">📋</div>
          <div className="text-sm font-medium text-gray-600 sm:text-base">
            선택한 날짜에 메뉴 데이터가 없습니다
          </div>
          <div className="mt-2 text-xs text-gray-400 sm:text-sm">
            다른 날짜를 선택해보세요
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
