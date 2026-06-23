import { describe, expect, it } from 'vitest';

import dayjs from '@/lib/dayjs';

import { buildDateUrl, resolveDateQuery } from './dateQuery';

describe('resolveDateQuery', () => {
  const today = dayjs('2026-06-23').tz();
  const minDate = dayjs('2026-06-16').tz();
  const maxDate = dayjs('2026-07-05').tz();

  it('returns the queried date when it is valid and in range', () => {
    expect(
      resolveDateQuery('2026-06-30', { today, minDate, maxDate }).format(
        'YYYY-MM-DD'
      )
    ).toBe('2026-06-30');
  });

  it('falls back to today when the query is invalid', () => {
    expect(
      resolveDateQuery('2026-6-30', { today, minDate, maxDate }).format(
        'YYYY-MM-DD'
      )
    ).toBe('2026-06-23');
  });

  it('falls back to today when the query is outside bounds', () => {
    expect(
      resolveDateQuery('2026-07-06', { today, minDate, maxDate }).format(
        'YYYY-MM-DD'
      )
    ).toBe('2026-06-23');
  });
});

describe('buildDateUrl', () => {
  it('sets date while preserving existing query params', () => {
    expect(
      buildDateUrl('https://mega-bobs.example/?foo=bar&date=2026-06-22', {
        date: '2026-06-23',
      })
    ).toBe('https://mega-bobs.example/?foo=bar&date=2026-06-23');
  });
});
