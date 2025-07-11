import { WeeklyMenu } from './types'

export const mockWeeklyMenu: WeeklyMenu = {
  startDate: '2024-07-07',
  endDate: '2024-07-11',
  menus: [
    {
      date: '2024-07-07',
      meals: {
        breakfast: {
          totalCalories: 500,
          items: [
            {
              name: '백미밥',
              calories: 150,
              description: '국내산 쌀',
            },
            {
              name: '된장찌개',
              calories: 80,
              description: '콩나물, 두부',
            },
            {
              name: '계란말이',
              calories: 120,
              description: '신선한 계란',
            },
            {
              name: '김치',
              calories: 20,
              description: '배추김치',
            },
            {
              name: '우유',
              calories: 130,
              description: '200ml',
            },
          ],
        },
        lunch: {
          totalCalories: 700,
          items: [
            {
              name: '잡곡밥',
              calories: 170,
              description: '국내산 잡곡',
            },
            {
              name: '미역국',
              calories: 100,
              description: '국산 미역',
            },
            {
              name: '제육볶음',
              calories: 300,
              description: '국내산 돼지고기',
            },
            {
              name: '시금치나물',
              calories: 50,
              description: '국내산 시금치',
            },
            {
              name: '김치',
              calories: 20,
              description: '배추김치',
            },
          ],
        },
        dinner: {
          totalCalories: 650,
          items: [
            {
              name: '현미밥',
              calories: 160,
              description: '국내산 현미',
            },
            {
              name: '순두부찌개',
              calories: 120,
              description: '국내산 두부',
            },
            {
              name: '고등어구이',
              calories: 250,
              description: '노르웨이산 고등어',
            },
            {
              name: '숙주나물',
              calories: 40,
              description: '국내산 숙주',
            },
            {
              name: '김치',
              calories: 20,
              description: '배추김치',
            },
          ],
        },
      },
    },
  ],
} 