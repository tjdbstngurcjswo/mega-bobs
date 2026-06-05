import dayjs from '@/lib/dayjs';
import {getWeekDays} from '@/lib/utils';

/** 구내식당 운영 정보 — 하드코딩 1곳에만 둔다 (§5.1: 마감 시각은 여기서 파생) */
export const CAFETERIA = {
  openLabel: '11:00 – 13:15',
  closeHour: 13,
} as const;

/** 월요일 시작 주의 첫날 — getWeekDays(로케일 비의존)와 동일 기준 */
const startOfWeekMon = (d: dayjs.Dayjs) => getWeekDays(d)[0];

/** date가 today 기준 다음 주에 속하는가 */
export const isNextWeek = (date: dayjs.Dayjs, today: dayjs.Dayjs) =>
  startOfWeekMon(date).isSame(startOfWeekMon(today).add(7, 'day'), 'day');

/** 다음 주 메뉴 공개 여부 — 매주 목요일 공개 (목·금·토·일 = 공개됨) */
export const isNextWeekPublished = (now: dayjs.Dayjs) => {
  const d = now.day();
  return d === 0 || d >= 4;
};
