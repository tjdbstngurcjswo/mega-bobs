'use client';

import dayjs from 'dayjs';
import {useEffect, useState} from 'react';

import MobileContainer from '@/components/layout/MobileContainer';
import useListWeeklyMenu from '@/lib/hooks/queries/useListWeeklyMenu';
import {formatYYYYMMDD, getWeekDays} from '@/lib/utils';
import {CategoryEnum, MenuItemType} from '@/types/MenuType';

import CourseSelect from './CourseSelect';
import DaySelect from './DaySelect';
import ErrorBoundary from './ErrorBoundary';
import Header from './Header';
import CalendarContainer from './layout/CalendarContainer';
import MenuContainer from './layout/MenuContainer';
import MenuSection from './MenuSection';
import WeekSelect from './WeekSelect';

interface HomeClientProps {
  initialDate: string;
}

const HomeClient = ({initialDate}: HomeClientProps) => {
  const [date, setDate] = useState(dayjs(initialDate).toDate());
  const [week, setWeek] = useState(getWeekDays(dayjs(initialDate).toDate()));
  const [category, setCategory] = useState<CategoryEnum>('COURSE_1');

  useEffect(() => {
    const currentWeek = getWeekDays(dayjs().toDate());
    const isCurrentWeek = dayjs(week[0]).isSame(dayjs(currentWeek[0]), 'week');
    if (isCurrentWeek) setDate(dayjs(initialDate).toDate());
    else setDate(week[0]);
  }, [week, initialDate]);

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
