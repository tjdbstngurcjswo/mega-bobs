import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

export const SEOUL_TIMEZONE = 'Asia/Seoul';

export const seoulNow = () => dayjs.tz(new Date(), SEOUL_TIMEZONE);

export default dayjs;
