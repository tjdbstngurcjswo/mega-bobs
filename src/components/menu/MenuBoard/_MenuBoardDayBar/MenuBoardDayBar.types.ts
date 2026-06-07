import type { Dayjs } from 'dayjs';

export interface MenuBoardDayChipProps {
  day: Dayjs;
  today: Dayjs;
  selectedDate: Dayjs;
  onSelect: (day: Dayjs) => void;
  mounted: boolean;
}
