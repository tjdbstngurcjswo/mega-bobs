import { CAFETERIA_CLOSE_MIN } from '@/constants/cafeteria';
import dayjs from '@/lib/dayjs';

/** 구내식당 영업 종료 시각 이후인지 반환한다. */
export const isAfterClose = (now: dayjs.Dayjs) => {
  const nowMin = now.hour() * 60 + now.minute();
  return nowMin >= CAFETERIA_CLOSE_MIN;
};

/**
 * 메뉴 데이터가 없는 미래 평일을 미등록 상태로 분류한다.
 * 오늘·과거와 주말은 실제 휴무일 수 있으므로 미등록으로 간주하지 않는다.
 */
export const isFutureMenuPending = (
  selectedDate: dayjs.Dayjs,
  now: dayjs.Dayjs
) => {
  const day = selectedDate.day();
  const isWeekend = day === 0 || day === 6;

  return selectedDate.isAfter(now, 'day') && !isWeekend;
};
