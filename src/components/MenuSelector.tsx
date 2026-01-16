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

  console.log('menu selector date', date.toString());
  const selectedItems =
    (menus.find(
      (item) => item.date === formatYYYYMMDD(date) && item.category === category
    )?.items as MenuItemType[]) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-slate-900 px-4 dark:bg-[#181A20]">
        <WeekSelect week={week} onChange={setWeek} />
        <DaySelect date={date} week={week} onChange={setDate} />
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-4">
        <CourseSelect category={category} onChange={setCategory} />
        <MenuSection items={selectedItems} />
      </div>
    </div>
  );
};

export default MenuSelector;
