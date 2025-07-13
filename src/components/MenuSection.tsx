import React from 'react';

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
      <div className="flex h-full flex-col rounded-xl bg-white shadow-lg drop-shadow-2xl">
        <div className="z-1 flex items-center justify-between rounded-t-xl bg-slate-100 px-8 py-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-slate-800">{type}</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  if (items && items.length > 0) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-white shadow-lg drop-shadow-2xl">
        <div className="z-1 flex items-center justify-between rounded-t-xl bg-slate-100 px-8 py-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-slate-800">{type}</h2>
            </div>
          </div>
          <div className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
            {items.reduce((sum, item) => sum + item.kcal, 0)} kcal
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {items.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-white shadow-lg drop-shadow-2xl">
      <div className="z-1 flex items-center justify-between rounded-t-xl bg-slate-100 px-8 py-4 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-slate-800">{type}</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-lg text-gray-500">📋</div>
          <div className="text-base text-gray-600">
            선택한 날짜에 메뉴 데이터가 없습니다
          </div>
          <div className="mt-1 text-sm text-gray-400">
            다른 날짜를 선택해보세요
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
