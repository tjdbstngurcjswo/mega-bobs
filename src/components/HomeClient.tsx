'use client';

import {use, useState} from 'react';

import MainWidget from '@/components/MainWidget';
import {DailyMenu} from '@/types/DailyMenu';

import QueryProvider from './QueryProvider';
import WeekSelect from './WeekSelect';
import CourseSelect from './CourseSelect';

interface HomeClientProps {
  initialMenu: Promise<DailyMenu>;
  initialDate: Date;
}

export function HomeClient({initialMenu, initialDate}: HomeClientProps) {
  const menu = use(initialMenu);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedCourse, setSelectedCourse] = useState<'1' | '2' | 'take-out'>(
    '1'
  );

  return (
    <QueryProvider>
      <MainWidget>
        <WeekSelect currentDate={selectedDate} onChange={setSelectedDate} />
        <CourseSelect
          selectedCourse={selectedCourse}
          onChange={setSelectedCourse}
        />
        {JSON.stringify(menu)}
      </MainWidget>
    </QueryProvider>
  );
}
