'use client';

import {useState} from 'react';

import MobileContainer from '@/components/layout/MobileContainer';
import {CategoryEnum, MenuItemType} from '@/types/MenuType';

import CourseSelect from './CourseSelect';
import ErrorBoundary from './ErrorBoundary';
import Header from './Header';
import MenuSection from './MenuSection';
import WeekSelect from './WeekSelect';
import useListWeeklyMenu from '@/lib/hooks/queries/useListWeeklyMenu';
import {formatYYYYMMDD} from '@/lib/utils';
import DaySelect from './DaySelect';
import CalendarContainer from './layout/CalendarContainer';
import MenuContainer from './layout/MenuContainer';

interface HomeClientProps {
  initialDate: Date;
  initialWeek: Date[];
}

const HomeClient = ({initialDate, initialWeek}: HomeClientProps) => {
  const [date, setDate] = useState(initialDate);
  const [week, setWeek] = useState(initialWeek);
  const [category, setCategory] = useState<CategoryEnum>('COURSE_1');

  const {data: dataToListWeeklyMenu, isLoading} = useListWeeklyMenu(
    week[0],
    week[6]
  );

  return (
    <MobileContainer>
      <ErrorBoundary>
        <Header />
        <CalendarContainer>
          <WeekSelect week={week} onChange={setWeek} />
          <DaySelect date={date} week={week} onChange={setDate} />
        </CalendarContainer>
        <MenuContainer>
          <CourseSelect category={category} onChange={setCategory} />
          <MenuSection
            items={
              (dataToListWeeklyMenu?.find(
                (item) =>
                  item.date === formatYYYYMMDD(date) &&
                  item.category === category
              )?.items as MenuItemType[]) ?? []
            }
            isLoading={isLoading}
          />
        </MenuContainer>
      </ErrorBoundary>
    </MobileContainer>
  );
};

export default HomeClient;
