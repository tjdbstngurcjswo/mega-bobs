import dayjs from '@/lib/dayjs';
import { formatYYYYMMDD } from '@/utils/date';

export const DATE_QUERY_PARAM = 'date';

const DATE_QUERY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface ResolveDateQueryOptions {
  today: dayjs.Dayjs;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
}

interface BuildDateUrlOptions {
  date: string;
}

export const isDateWithinBounds = (
  date: dayjs.Dayjs,
  minDate: dayjs.Dayjs,
  maxDate: dayjs.Dayjs
) => !date.isBefore(minDate, 'day') && !date.isAfter(maxDate, 'day');

export const parseDateQuery = (value: string | null): dayjs.Dayjs | null => {
  if (!value || !DATE_QUERY_PATTERN.test(value)) return null;
  const parsed = dayjs.tz(value);
  if (!parsed.isValid() || formatYYYYMMDD(parsed) !== value) return null;
  return parsed;
};

export const resolveDateQuery = (
  value: string | null,
  { today, minDate, maxDate }: ResolveDateQueryOptions
) => {
  const parsed = parseDateQuery(value);
  if (!parsed || !isDateWithinBounds(parsed, minDate, maxDate)) return today;
  return parsed;
};

export const buildDateUrl = (href: string, { date }: BuildDateUrlOptions) => {
  const url = new URL(href);
  url.searchParams.set(DATE_QUERY_PARAM, date);
  return url.toString();
};
