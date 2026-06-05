import {describe, expect, test} from 'vitest';

import dayjs from '@/lib/dayjs';
import {CAFETERIA, isNextWeek, isNextWeekPublished} from '@/lib/menu-policy';

describe('isNextWeekPublished — 다음 주 메뉴는 목요일 공개', () => {
  test('월요일에는 미공개', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-01'))).toBe(false); // 월
  });
  test('수요일에도 미공개', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-03'))).toBe(false); // 수
  });
  test('화요일에도 미공개', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-02'))).toBe(false); // 화
  });
  test('목요일부터 공개', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-04'))).toBe(true); // 목
  });
  test('토요일에도 공개 상태 유지', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-06'))).toBe(true); // 토
  });
  test('일요일(주말)에도 공개 상태 유지', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-07'))).toBe(true); // 일
  });
});

describe('isNextWeek — 기준일이 오늘의 다음 주인지', () => {
  const today = dayjs.tz('2026-06-05'); // 금
  test('다음 주 월요일은 true', () => {
    expect(isNextWeek(dayjs.tz('2026-06-08'), today)).toBe(true);
  });
  test('오늘(같은 주)은 false', () => {
    expect(isNextWeek(today, today)).toBe(false);
  });
  test('이번 주 일요일은 false', () => {
    expect(isNextWeek(dayjs.tz('2026-06-07'), today)).toBe(false);
  });
  test('지난주는 false', () => {
    expect(isNextWeek(dayjs.tz('2026-05-29'), today)).toBe(false);
  });
});

test('CAFETERIA 운영시간 상수', () => {
  expect(CAFETERIA.openLabel).toBe('11:00 – 13:15');
  expect(CAFETERIA.closeHour).toBe(13);
});
