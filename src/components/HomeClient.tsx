'use client';

import {use, useState} from 'react';

import MainWidget from '@/components/MainWidget';
import {DailyMenu} from '@/types/DailyMenu';

import QueryProvider from './QueryProvider';
import WeekSelect from './WeekSelect';

interface HomeClientProps {
  initialMenu: Promise<DailyMenu>;
  initialDate: Date;
}

export function HomeClient({initialMenu, initialDate}: HomeClientProps) {
  const menu = use(initialMenu);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  // const [selectedMeal, setSelectedMeal] = useState('lunch')

  return (
    <QueryProvider>
      <MainWidget>
        <WeekSelect currentDate={selectedDate} onChange={setSelectedDate} />
        {/* <DaySelect
            days={days}
            onSelectDay={setSelectedDate}
          /> */}
        {JSON.stringify(menu)}
      </MainWidget>
    </QueryProvider>
  );
}
