'use client';

import {useState} from 'react';

import {DEFAULT_MENU_CATEGORY} from '@/constants/menu';
import {formatYYYYMMDD} from '@/lib/utils';
import {MenuCategory, MenuItemType, MenuType} from '@/types/menu';

import CourseSelect from './CourseSelect';
import DaySelect from './DaySelect';
import MenuSection from './MenuSection';
import WeekSelect from './WeekSelect';

interface MenuSelectorProps {
  menus: MenuType[];
  initialDate: Date;
  initialWeek: Date[];
}

const MenuSelector = ({menus, initialDate, initialWeek}: MenuSelectorProps) => {
  const [date, setDate] = useState(initialDate);
  const [week, setWeek] = useState(initialWeek);
  const [category, setCategory] = useState<MenuCategory>(DEFAULT_MENU_CATEGORY);

  const selectedItems =
    (menus.find(
      (item) => item.date === formatYYYYMMDD(date) && item.category === category
    )?.items as MenuItemType[]) ?? [];

  return (
    <>
      <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 p-3 text-white sm:gap-4 dark:from-[#23242B] dark:to-[#181A20] dark:text-white">
        <WeekSelect week={week} onChange={setWeek} />
        <DaySelect date={date} week={week} onChange={setDate} />
      </div>
      <div className="flex flex-1 flex-col gap-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-4">
        <CourseSelect category={category} onChange={setCategory} />
        <MenuSection items={selectedItems} />
      </div>
    </>
  );
};

export default MenuSelector;
