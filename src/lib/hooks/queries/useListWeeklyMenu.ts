import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';

import getWeeklyMenu from '@/lib/api/getWeeklyMenu';
import {MenuType} from '@/types/MenuType';

const useListWeeklyMenu = (start: Date, end: Date) => {
  const startString = dayjs(start).format('YYYY-MM-DD');
  const endString = dayjs(end).format('YYYY-MM-DD');

  return useQuery<MenuType[]>({
    queryKey: ['LIST_WEEKLY_MENU', startString, endString],
    queryFn: async () =>
      await getWeeklyMenu({start: startString, end: endString}),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export default useListWeeklyMenu;
