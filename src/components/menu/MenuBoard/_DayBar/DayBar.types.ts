import type { Dayjs } from 'dayjs';

export interface DayChipProps {
  day: Dayjs;
  today: Dayjs;
  selectedDate: Dayjs;
  onSelect: (day: Dayjs) => void;
  mounted: boolean;
}
