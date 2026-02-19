'use client';

import {useEffect} from 'react';

import {useMenuStore} from '@/store/useMenuStore';
import {MenuType} from '@/types/menu';

import CourseSelect from './CourseSelect';
import DaySelect from './DaySelect';
import MenuSection from './MenuSection';
import WeekSelect from './WeekSelect';

interface MenuSelectorProps {
  menus: MenuType[];
}

const MenuSelector = ({menus}: MenuSelectorProps) => {
  const setMenus = useMenuStore((state) => state.setMenus);

  useEffect(() => {
    setMenus(menus);
  }, [menus, setMenus]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-slate-900 px-4 dark:bg-[#181A20]">
        <WeekSelect />
        <DaySelect />
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-4">
        <CourseSelect />
        <MenuSection />
      </div>
    </div>
  );
};

export default MenuSelector;
