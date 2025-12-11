import ErrorBoundary from '@/components/ErrorBoundary';
import Header from '@/components/Header';
import MobileContainer from '@/components/layout/MobileContainer';
import MenuSelector from '@/components/MenuSelector';
import {DateProvider} from '@/contexts/DateContext';
import getMenu from '@/lib/api/getMenu';
import dayjs from '@/lib/dayjs';
import {formatYYYYMMDD, getWeekDays} from '@/lib/utils';

export const revalidate = 21600;

export default async function Home() {
  const today = dayjs().toDate();
  const currentWeek = getWeekDays(today);
  const previousWeek = getWeekDays(dayjs(today).subtract(1, 'week').toDate());
  const nextWeek = getWeekDays(dayjs(today).add(1, 'week').toDate());

  const start = formatYYYYMMDD(previousWeek[0]);
  const end = formatYYYYMMDD(nextWeek[6]);

  const menus = await getMenu({start, end});

  return (
    <DateProvider today={today}>
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
    </DateProvider>
  );
}
