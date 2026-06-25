import { getNotices } from '@/api/getNotices';

import SiteHeader from './SiteHeader';

const SiteHeaderServer = async () => {
  const notices = await getNotices();
  return <SiteHeader notices={notices} />;
};

export default SiteHeaderServer;
