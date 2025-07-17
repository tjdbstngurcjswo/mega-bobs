'use client';

import dayjs from 'dayjs';
import {useEffect, useState} from 'react';

import MobileContainer from '@/components/layout/MobileContainer';
import useListWeeklyMenu from '@/lib/hooks/queries/useListWeeklyMenu';
import {formatYYYYMMDD, getWeekRange} from '@/lib/utils';
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
  initialDate: Date;
  initialWeek: Date[];
}

const HomeClient = ({initialDate, initialWeek}: HomeClientProps) => {
  const [date, setDate] = useState(initialDate);
  const [week, setWeek] = useState(initialWeek);
  const [category, setCategory] = useState<CategoryEnum>('COURSE_1');

  // week가 이번주가 아닐 때 해당 주의 월요일로 날짜 설정
  useEffect(() => {
    const currentWeek = getWeekRange(new Date());
    const isCurrentWeek = dayjs(week[0]).isSame(dayjs(currentWeek[0]), 'week');

    if (!isCurrentWeek) {
      setDate(week[0]); // 이번주가 아니면 해당 주의 월요일로 설정
    } else {
      setDate(new Date()); // 이번주이면 오늘 날짜로 설정
    }
  }, [week]);

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
