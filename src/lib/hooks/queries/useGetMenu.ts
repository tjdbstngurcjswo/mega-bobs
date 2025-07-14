import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';

import getMenu from '@/lib/api/getMenu';
import {CategoryEnum, MenuType} from '@/types/MenuType';

const useGetMenu = (date: Date, category: CategoryEnum) => {
  const dateString = dayjs(date).format('YYYY-MM-DD');
  return useQuery<MenuType>({
    queryKey: ['GET_MENU', dateString, category],
    queryFn: async () =>
      await getMenu({
        date: dateString,
        category,
      }),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export default useGetMenu;
