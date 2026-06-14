import dayjs from '@/lib/dayjs';

/** Dayjs 날짜를 `YYYY-MM-DD` 문자열로 변환한다. */
export const formatYYYYMMDD = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD');

/**
 * 오늘·어제·그저께면 한국어 레이블, 그 외엔 fallbackFormat 으로 포맷한다.
 * @param date ISO 문자열 또는 YYYY-MM-DD
 * @param fallbackFormat dayjs 포맷 문자열 (기본 'YYYY년 MM월 DD일 HH:mm')
 * @param hoursIfToday true 이면 오늘일 때 'N시간 전' / '방금 전' 으로 표시
 */
export const formatRelativeDate = (
  date: string,
  fallbackFormat = 'YYYY년 MM월 DD일 HH:mm',
  hoursIfToday = false
): string => {
  const now = dayjs().tz();
  const target = dayjs(date).tz();
  const today = now.format('YYYY-MM-DD');
  const yesterday = now.subtract(1, 'day').format('YYYY-MM-DD');
  const twoDaysAgo = now.subtract(2, 'day').format('YYYY-MM-DD');
  const dateKey = target.format('YYYY-MM-DD');
  if (dateKey === today) {
    if (hoursIfToday) {
      const diffHours = now.diff(target, 'hour');
      return diffHours < 1 ? '방금 전' : `${diffHours}시간 전`;
    }
    return '오늘';
  }
  if (dateKey === yesterday) return '어제';
  if (dateKey === twoDaysAgo) return '그저께';
  return target.format(fallbackFormat);
};

/**
 * date가 속한 주의 월~일 7일 배열을 반환한다.
 * 일요일(0)은 7로 처리해 월요일 시작 기준으로 계산한다.
 */
export const getWeekDays = (date: dayjs.Dayjs): dayjs.Dayjs[] => {
  const day = date.day() === 0 ? 7 : date.day();
  const weekStart = date.subtract(day - 1, 'day').startOf('day');
  return Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));
};
