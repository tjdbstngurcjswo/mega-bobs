import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';

import {DailyMenu} from '@/types/DailyMenu';

import getMenu from '../api/getMenu';

export function useGetMenu(date: Date, initialData: DailyMenu) {
  return useQuery<DailyMenu>({
    queryKey: ['menu', date],
    queryFn: async() => await getMenu(dayjs(date).format('YYYY-MM-DD')),
    initialData,
  });
} 