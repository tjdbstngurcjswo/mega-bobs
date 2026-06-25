'use client';

import { useEffect, useRef } from 'react';

import dayjs from '@/lib/dayjs';
import { useDateStore } from '@/store/useDateStore';
import { formatYYYYMMDD } from '@/utils/date';

const DATE_PARAM_FORMAT = 'YYYY-MM-DD';

export const useDateUrl = () => {
  const { selectedDate, minDate, maxDate, initFromDate } = useDateStore();
  const mounted = useRef(false);

  useEffect(() => {
    const dateStr = formatYYYYMMDD(selectedDate);
    const url = new URL(window.location.href);

    if (!mounted.current) {
      mounted.current = true;
      const param = url.searchParams.get('date');
      if (param) {
        const parsed = dayjs(param, DATE_PARAM_FORMAT, true).tz();
        if (
          parsed.isValid() &&
          !parsed.isBefore(minDate, 'day') &&
          !parsed.isAfter(maxDate, 'day')
        ) {
          initFromDate(parsed);
          return;
        }
      }
    }

    url.searchParams.set('date', dateStr);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    // minDate, maxDate, initFromDate are stable store values — intentionally omitted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);
};
