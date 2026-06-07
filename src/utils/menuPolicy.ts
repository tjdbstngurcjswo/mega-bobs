import dayjs from '@/lib/dayjs';
import {CAFETERIA_CLOSE_MIN} from '@/constants/cafeteria';
import {getWeekDays} from '@/utils/date';

/** @internal 월요일 시작 주의 첫날. getWeekDays와 동일 기준. */
const startOfWeekMon = (d: dayjs.Dayjs) => getWeekDays(d)[0];

/** date가 today 기준 다음 주에 속하는지 반환한다. */
export const isNextWeek = (date: dayjs.Dayjs, today: dayjs.Dayjs) =>
  startOfWeekMon(date).isSame(startOfWeekMon(today).add(7, 'day'), 'day');

/**
 * 다음 주 메뉴 공개 여부를 반환한다.
 * 매주 목요일부터 공개 — 목(4)·금(5)·토(6)·일(0) = true.
 */
export const isNextWeekPublished = (now: dayjs.Dayjs) => {
  const d = now.day();
  return d === 0 || d >= 4;
};

/** 구내식당 영업 종료 시각 이후인지 반환한다. */
export const isAfterClose = (now: dayjs.Dayjs) => {
  const nowMin = now.hour() * 60 + now.minute();
  return nowMin >= CAFETERIA_CLOSE_MIN;
};
