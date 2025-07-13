'use client';

import {use, useState} from 'react';

import MainWidget from '@/components/MainWidget';
import useGetMenu from '@/lib/hooks/useGetMenu';
import {CategoryEnum, MenuItemType, MenuType} from '@/types/MenuType';

import DaySelect from './DaySelect';
import {ErrorBoundary} from './ErrorBoundary';
import MenuSection from './MenuSection';
import {Tab, Tabs} from './ui/tabs';
import WeekSelect from './WeekSelect';

interface HomeClientProps {
  initialMenu: Promise<MenuType>;
  initialCategory: CategoryEnum;

  initialDate: Date;
}
const MEAL_TYPES: CategoryEnum[] = ['COURSE_1', 'COURSE_2', 'TAKE_OUT'];

const HomeClient = ({
  initialMenu,
  initialCategory,
  initialDate,
}: HomeClientProps) => {
  const menu = use(initialMenu);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const {data: dataToGetMenu} = useGetMenu(
    selectedDate,
    selectedCategory,
    menu
  );

  return (
    <MainWidget>
      <ErrorBoundary notFoundFallback={<div>Not Found</div>}>
        <WeekSelect currentDate={selectedDate} onChange={setSelectedDate} />
        <DaySelect currentDate={selectedDate} onChange={setSelectedDate} />
        <Tabs>
          {MEAL_TYPES.map((type) => (
            <Tab
              key={type}
              isActive={type === dataToGetMenu.category}
              onClick={() => setSelectedCategory(type)}
            >
              {type}
            </Tab>
          ))}
        </Tabs>
        <MenuSection
          type={dataToGetMenu.category}
          items={dataToGetMenu.items as MenuItemType[]}
        />
      </ErrorBoundary>
    </MainWidget>
  );
};

export default HomeClient;
