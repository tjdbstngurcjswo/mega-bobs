import { describe, expect, it } from 'vitest';

import dayjs from '@/lib/dayjs';
import { formatYYYYMMDD, getMenuDateRange } from '@/utils/date';

describe('getMenuDateRange', () => {
  it('spans last Monday through the Sunday of next week', () => {
    const friday = dayjs.tz('2026-11-27', 'Asia/Seoul');
    const { minDate, maxDate } = getMenuDateRange(friday);

    expect(formatYYYYMMDD(minDate)).toBe('2026-11-16');
    expect(formatYYYYMMDD(maxDate)).toBe('2026-12-06');
  });

  it('keeps the same window on Sunday as the rest of that week', () => {
    const sunday = dayjs.tz('2026-11-29', 'Asia/Seoul');
    const { minDate, maxDate } = getMenuDateRange(sunday);

    expect(formatYYYYMMDD(minDate)).toBe('2026-11-16');
    expect(formatYYYYMMDD(maxDate)).toBe('2026-12-06');
  });

  it('slides forward when the week changes on Monday', () => {
    const monday = dayjs.tz('2026-11-30', 'Asia/Seoul');
    const { minDate, maxDate } = getMenuDateRange(monday);

    expect(formatYYYYMMDD(minDate)).toBe('2026-11-23');
    expect(formatYYYYMMDD(maxDate)).toBe('2026-12-13');
  });
});
