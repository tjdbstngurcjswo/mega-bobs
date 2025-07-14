'use client';

import {useState} from 'react';

import {MobileContainer} from '@/components/layout';
import useGetMenu from '@/lib/hooks/queries/useGetMenu';
import {CategoryEnum, MenuItemType} from '@/types/MenuType';

import CourseSelect from './CourseSelect';
import {ErrorBoundary} from './ErrorBoundary';
import Header from './Header';
import MenuSection from './MenuSection';
import WeekSelect from './WeekSelect';

interface HomeClientProps {
  initialCategory: CategoryEnum;
  initialDate: Date;
}

const HomeClient = ({initialCategory, initialDate}: HomeClientProps) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const {data: dataToGetMenu, isFetching} = useGetMenu(
    selectedDate,
    selectedCategory
  );

  return (
    <MobileContainer>
      <ErrorBoundary notFoundFallback={<div>Not Found</div>}>
        <Header />
        <WeekSelect currentDate={selectedDate} onChange={setSelectedDate} />
        <div className="flex flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-4">
          <CourseSelect
            selectedCourse={selectedCategory}
            onChange={setSelectedCategory}
          />
          <div className="min-h-0 flex-1 overflow-auto">
            <MenuSection
              items={dataToGetMenu?.items as MenuItemType[]}
              isLoading={isFetching}
            />
          </div>
        </div>
      </ErrorBoundary>
    </MobileContainer>
  );
};

export default HomeClient;
