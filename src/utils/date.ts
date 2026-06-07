import dayjs from '@/lib/dayjs';

/** Dayjs 날짜를 `YYYY-MM-DD` 문자열로 변환한다. */
export const formatYYYYMMDD = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD');

/**
 * date가 속한 주의 월~일 7일 배열을 반환한다.
 * 일요일(0)은 7로 처리해 월요일 시작 기준으로 계산한다.
 */
export const getWeekDays = (date: dayjs.Dayjs): dayjs.Dayjs[] => {
  const day = date.day() === 0 ? 7 : date.day();
  const weekStart = date.subtract(day - 1, 'day').startOf('day');
  return Array.from({length: 7}, (_, i) => weekStart.add(i, 'day'));
};
