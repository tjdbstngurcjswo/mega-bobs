'use client'

import { DaySelect } from '@/components/day-select'
import { MainWidget } from '@/components/main-widget'
import { MenuBoard } from '@/components/menu-board'
import { WeekSelect } from '@/components/week-select'
import { mockWeeklyMenu } from '@/lib/mock'
import { MealType } from '@/lib/types'
import { useState } from 'react'

export default function Home() {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch')
  const [selectedDate, setSelectedDate] = useState(7)
  const todayMenu = mockWeeklyMenu.menus[0]

  const days = [
    { label: '월', date: 7, isSelected: selectedDate === 7 },
    { label: '화', date: 8, isSelected: selectedDate === 8 },
    { label: '수', date: 9, isSelected: selectedDate === 9 },
    { label: '목', date: 10, isSelected: selectedDate === 10 },
    { label: '금', date: 11, isSelected: selectedDate === 11 },
  ]

  return (
    <MainWidget>
      <WeekSelect
        currentWeek="7월 7일 - 7월 11일"
        onPrevWeek={() => {}}
        onNextWeek={() => {}}
      />
      <DaySelect
        days={days}
        onSelectDay={setSelectedDate}
      />
      <MenuBoard
        selectedMeal={selectedMeal}
        onMealSelect={setSelectedMeal}
        menuItems={todayMenu.meals[selectedMeal].items}
      />
    </MainWidget>
  )
}
