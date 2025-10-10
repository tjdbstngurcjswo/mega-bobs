import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import HomeClient from '@/components/HomeClient';
import getWeeklyMenu from '@/lib/api/getWeeklyMenu';
import {formatYYYYMMDD, getWeekDays} from '@/lib/utils';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

export const revalidate = 21600;

export default async function Home() {
  const today = dayjs().toDate();
  const previousWeek = getWeekDays(dayjs(today).subtract(1, 'week').toDate());
  const nextWeek = getWeekDays(dayjs(today).add(1, 'week').toDate());

  const start = formatYYYYMMDD(previousWeek[0]);
  const end = formatYYYYMMDD(nextWeek[6]);

  const menus = await getWeeklyMenu({start, end});

  return <HomeClient menus={menus} />;
}
