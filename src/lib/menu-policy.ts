import dayjs from '@/lib/dayjs';
import {getWeekDays} from '@/lib/utils';

const pad = (n: number) => String(n).padStart(2, '0');

/** 구내식당 운영 시각 config — 여기만 수정하면 전체 반영 */
export const CAFETERIA = {
  openHour: 11,
  openMinute: 0,
  closeHour: 13,
  closeMinute: 15,
} as const;

export const CAFETERIA_OPEN_MIN = CAFETERIA.openHour * 60 + CAFETERIA.openMinute;
export const CAFETERIA_CLOSE_MIN = CAFETERIA.closeHour * 60 + CAFETERIA.closeMinute;
export const CAFETERIA_LABEL = `${pad(CAFETERIA.openHour)}:${pad(CAFETERIA.openMinute)} – ${pad(CAFETERIA.closeHour)}:${pad(CAFETERIA.closeMinute)}`;

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

/** 영업 종료(13:15) 이후인지 여부 */
export const isAfterClose = (now: dayjs.Dayjs) => {
  const nowMin = now.hour() * 60 + now.minute();
  return nowMin >= CAFETERIA_CLOSE_MIN;
};
