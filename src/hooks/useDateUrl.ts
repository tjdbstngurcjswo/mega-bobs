'use client';

import { useEffect } from 'react';

import dayjs, { SEOUL_TIMEZONE } from '@/lib/dayjs';
import { useDateStore } from '@/store/useDateStore';
import { formatYYYYMMDD } from '@/utils/date';

const DATE_PARAM_FORMAT = 'YYYY-MM-DD';
const DATE_PARAM_KEY = 'date';

export const useDateUrl = () => {
  const { selectedDate, minDate, maxDate, initFromDate } = useDateStore();

  // URL → store: mount only, parse directly in KST to avoid local-tz offset
  useEffect(() => {
    const param = new URL(window.location.href).searchParams.get(
      DATE_PARAM_KEY
    );
    if (!param) return;
    const parsed = dayjs.tz(param, DATE_PARAM_FORMAT, SEOUL_TIMEZONE);
    if (
      parsed.isValid() &&
      !parsed.isBefore(minDate, 'day') &&
      !parsed.isAfter(maxDate, 'day')
    ) {
      initFromDate(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // store → URL: keep ?date= in sync with selectedDate
  useEffect(() => {
    const url = new URL(window.location.href);
    const dateStr = formatYYYYMMDD(selectedDate);
    if (url.searchParams.get(DATE_PARAM_KEY) === dateStr) return;
    url.searchParams.set(DATE_PARAM_KEY, dateStr);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, [selectedDate]);
};
