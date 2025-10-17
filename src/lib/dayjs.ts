import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

let initialized = false;

const initializeDayjs = () => {
  if (initialized) return;

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Asia/Seoul');
  dayjs.locale('ko');

  initialized = true;
};

initializeDayjs();

export default dayjs;
