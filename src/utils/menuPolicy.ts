import dayjs from '@/lib/dayjs';
import { CAFETERIA_CLOSE_MIN } from '@/constants/cafeteria';
import { getWeekDays } from '@/utils/date';

/** 매주 목요일부터 다음 주 메뉴 공개 (0=일, 4=목) */
const NEXT_WEEK_PUBLICATION_DOW = 4;

/** @internal 월요일 시작 주의 첫날. getWeekDays와 동일 기준. */
const startOfWeekMon = (d: dayjs.Dayjs) => getWeekDays(d)[0];

/** date가 today 기준 다음 주에 속하는지 반환한다. */
const isNextWeek = (date: dayjs.Dayjs, today: dayjs.Dayjs) =>
  startOfWeekMon(date).isSame(startOfWeekMon(today).add(7, 'day'), 'day');

/**
 * 다음 주 메뉴 공개 여부를 반환한다.
 * 매주 목요일부터 공개 — 목(4)·금(5)·토(6)·일(0) = true.
 */
const isNextWeekPublished = (now: dayjs.Dayjs) => {
  const d = now.day();
  return d === 0 || d >= NEXT_WEEK_PUBLICATION_DOW;
};

/** 구내식당 영업 종료 시각 이후인지 반환한다. */
export const isAfterClose = (now: dayjs.Dayjs) => {
  const nowMin = now.hour() * 60 + now.minute();
  return nowMin >= CAFETERIA_CLOSE_MIN;
};

/** selectedDate가 다음 주이고 아직 메뉴가 비공개 상태인지 반환한다. */
export const isNextWeekMenuLocked = (
  selectedDate: dayjs.Dayjs,
  now: dayjs.Dayjs
) => isNextWeek(selectedDate, now) && !isNextWeekPublished(now);
