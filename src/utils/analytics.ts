import { track } from 'hongsoohyuk-beacon';

/**
 * 사용자 행동 이벤트를 beacon으로 기록한다.
 * 프로덕션에서만 SDK가 초기화되므로 그 외 환경에서는 전송되지 않는다.
 */
export const trackEvent = (
  name: string,
  props: Record<string, unknown> = {}
): void => {
  track(name, props);
};
