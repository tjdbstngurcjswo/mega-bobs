import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

export const SEOUL_TIMEZONE = 'Asia/Seoul';

let initialized = false;

const initializeDayjs = () => {
  if (initialized) return;

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault(SEOUL_TIMEZONE);
  dayjs.locale('ko');

  initialized = true;
};

initializeDayjs();

export const seoulNow = () => dayjs().tz(SEOUL_TIMEZONE);

export default dayjs;
