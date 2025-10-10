'use client';

import dayjs from 'dayjs';
import {useEffect,useState} from 'react';

import MobileContainer from '@/components/layout/MobileContainer';
import {formatYYYYMMDD,getWeekDays} from '@/lib/utils';
import {CategoryEnum,MenuItemType,MenuType} from '@/types/MenuType';

import CourseSelect from './CourseSelect';
import DaySelect from './DaySelect';
import ErrorBoundary from './ErrorBoundary';
import Header from './Header';
import CalendarContainer from './layout/CalendarContainer';
import MenuContainer from './layout/MenuContainer';
import MenuSection from './MenuSection';
import WeekSelect from './WeekSelect';

interface HomeClientProps {
  menus: MenuType[];
}

const HomeClient = ({menus}:HomeClientProps) => {
  const [today] = useState(() => dayjs().toDate());
  const [date, setDate] = useState(today);
  const [week, setWeek] = useState(getWeekDays(today));
  const [category, setCategory] = useState<CategoryEnum>('COURSE_1');

  useEffect(() => {
    const currentWeek = getWeekDays(today);
    const isCurrentWeek = dayjs(week[0]).isSame(dayjs(currentWeek[0]), 'week');
    setDate(isCurrentWeek ? today : week[0]);
  }, [today, week]);

  const selectedItems =
    (menus.find(
      (item) => item.date === formatYYYYMMDD(date) && item.category === category
    )?.items as MenuItemType[]) ?? [];

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
          <MenuSection items={selectedItems} />
        </MenuContainer>
      </ErrorBoundary>
    </MobileContainer>
  );
};

export default HomeClient;
