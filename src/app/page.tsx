import ErrorBoundary from '@/components/ErrorBoundary';
import Header from '@/components/Header';
import MobileContainer from '@/components/layout/MobileContainer';
import MenuSelector from '@/components/MenuSelector';
import getMenu from '@/lib/api/getMenu';
import dayjs, {SEOUL_TIMEZONE} from '@/lib/dayjs';
import {formatYYYYMMDD, getWeekDays} from '@/lib/utils';

export const revalidate = 21600;

export default async function Home() {
  // dayjs.tz()로 서울 타임존 기준 날짜 생성 (UTC 환경에서도 올바르게 동작)
  const today = dayjs.tz(new Date(), SEOUL_TIMEZONE).toDate();
  const currentWeek = getWeekDays(today);
  const previousWeek = getWeekDays(dayjs(today).subtract(1, 'week').toDate());
  const nextWeek = getWeekDays(dayjs(today).add(1, 'week').toDate());

  const start = formatYYYYMMDD(previousWeek[0]);
  const end = formatYYYYMMDD(nextWeek[6]);

  const menus = await getMenu({start, end});

  return (
    <MobileContainer>
      <ErrorBoundary>
        <Header />
        <MenuSelector
          menus={menus}
          initialDate={today}
          initialWeek={currentWeek}
        />
      </ErrorBoundary>
    </MobileContainer>
  );
}
