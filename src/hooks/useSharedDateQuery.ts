'use client';

import { useCallback, useEffect, useState } from 'react';

import { useDateStore } from '@/store/useDateStore';
import { formatYYYYMMDD } from '@/utils/date';
import {
  DATE_QUERY_PARAM,
  buildDateUrl,
  resolveDateQuery,
} from '@/utils/dateQuery';

export const useSharedDateQuery = () => {
  const { today, minDate, maxDate, selectedDate, setSelectedDate } =
    useDateStore();
  const [isQueryReady, setIsQueryReady] = useState(false);
  const dateStr = formatYYYYMMDD(selectedDate);

  const syncSelectedDateFromUrl = useCallback(() => {
    const queryDate = new URL(window.location.href).searchParams.get(
      DATE_QUERY_PARAM
    );
    setSelectedDate(resolveDateQuery(queryDate, { today, minDate, maxDate }));
  }, [maxDate, minDate, setSelectedDate, today]);

  useEffect(() => {
    syncSelectedDateFromUrl();
    setIsQueryReady(true);
  }, [syncSelectedDateFromUrl]);

  useEffect(() => {
    window.addEventListener('popstate', syncSelectedDateFromUrl);
    return () => {
      window.removeEventListener('popstate', syncSelectedDateFromUrl);
    };
  }, [syncSelectedDateFromUrl]);

  useEffect(() => {
    if (!isQueryReady) return;
    const nextUrl = buildDateUrl(window.location.href, { date: dateStr });
    if (nextUrl === window.location.href) return;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [dateStr, isQueryReady]);

  return dateStr;
};
