import axios from 'axios';

import {MenuType} from '@/types/MenuType';

const getWeeklyMenu = async (args: {start: string; end: string}) => {
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer ? process.env.NEXT_PUBLIC_SITE_URL : '';
  const {data} = await axios.get<MenuType[]>(`${baseUrl}/api/weekly-menu`, {
    params: {start: args.start, end: args.end},
  });
  return data;
};

export default getWeeklyMenu;
