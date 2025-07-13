'use client';

import {use, useState} from 'react';

import MainWidget from '@/components/MainWidget';
import useGetMenu from '@/lib/hooks/useGetMenu';
import {CategoryEnum, MenuItemType, MenuType} from '@/types/MenuType';

import CourseSelect from './CourseSelect';
import {ErrorBoundary} from './ErrorBoundary';
import Header from './Header';
import MenuSection from './MenuSection';
import WeekSelect from './WeekSelect';

interface HomeClientProps {
  initialMenu: Promise<MenuType>;
  initialCategory: CategoryEnum;
  initialDate: Date;
}

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
        <Header />
        <WeekSelect currentDate={selectedDate} onChange={setSelectedDate} />
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <div className="mb-3">
            <CourseSelect
              selectedCourse={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
          <div className="min-h-0 flex-1">
            <MenuSection
              type={selectedCategory}
              items={dataToGetMenu?.items as MenuItemType[]} // DB에서 주는게 JSON 이라 타입 변환 필요
            />
          </div>
        </div>
      </ErrorBoundary>
    </MainWidget>
  );
};

export default HomeClient;
