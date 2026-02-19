import ErrorBoundary from '@/components/ErrorBoundary';
import Header from '@/components/Header';
import MobileContainer from '@/components/layout/MobileContainer';
import MenuSelector from '@/components/MenuSelector';
import getMenu from '@/lib/api/getMenu';
import dayjs from '@/lib/dayjs';
import {formatYYYYMMDD} from '@/lib/utils';

export const revalidate = 21600;

export default async function Home() {
  const today = dayjs();
  const start = formatYYYYMMDD(
    today.subtract(1, 'week').startOf('week').add(1, 'day')
  );
  const end = formatYYYYMMDD(today.add(1, 'week').endOf('week').add(1, 'day'));

  const menus = await getMenu({start, end});

  return (
    <MobileContainer>
      <ErrorBoundary>
        <Header />
        <MenuSelector menus={menus} />
      </ErrorBoundary>
    </MobileContainer>
  );
}
