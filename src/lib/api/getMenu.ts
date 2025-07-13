import axios from 'axios';

import {CategoryEnum, MenuType} from '@/types/MenuType';

const getMenu = async (args: {date: string; category: CategoryEnum}) => {
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    : '';
  const {data} = await axios.get<MenuType>(`${baseUrl}/api/menu`, {
    params: {date: args.date, category: args.category},
  });
  return data;
};

export default getMenu;
