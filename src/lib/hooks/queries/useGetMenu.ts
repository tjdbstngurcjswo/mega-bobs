import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';

import getMenu from '@/lib/api/getMenu';
import {CategoryEnum, MenuType} from '@/types/MenuType';

const useGetMenu = (date: Date, category: CategoryEnum) =>
  useQuery<MenuType>({
    queryKey: ['GET_MENU', date, category],
    queryFn: async () =>
      await getMenu({
        date: dayjs(date).format('YYYY-MM-DD'),
        category,
      }),
    staleTime: 1000 * 60 * 5,
  });

export default useGetMenu;
