import { init } from 'hongsoohyuk-beacon';
import { isbot } from 'isbot';

import { BEACON_COLLECT_URL, BEACON_SITE_ID } from '@/constants/beacon';

/** 브라우저에서 beacon SDK를 1회 초기화한다. 봇은 수집하지 않는다. */
const initBeacon = () => {
  if (typeof navigator === 'undefined' || isbot(navigator.userAgent)) return;
  // 페이지뷰는 SDK가 SPA 내비게이션까지 자동 수집한다 (GA page_view 대체)
  init({ endpoint: BEACON_COLLECT_URL, siteId: BEACON_SITE_ID });
};

export default initBeacon;
