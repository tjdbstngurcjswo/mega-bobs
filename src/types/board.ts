import type {Dayjs} from 'dayjs';

import {MenuType} from './menu';
import {VoteResult, VoteType} from './vote';

export interface BoardEmptyProps {
  variant: 'closed' | 'comingUp';
  date?: string;
  isToday?: boolean;
  isPast?: boolean;
}

export interface CourseRowProps {
  menu: MenuType;
  index?: number;
  showVote?: boolean;
  voteResult?: VoteResult;
  onVote?: (type: VoteType) => void;
  isSubmitting?: boolean;
  showPick?: boolean;
  pickCount?: number;
  isPicked?: boolean;
  onPick?: () => void;
  isSubmittingPick?: boolean;
}

export interface DayChipProps {
  day: Dayjs;
  today: Dayjs;
  selectedDate: Dayjs;
  onSelect: (day: Dayjs) => void;
  mounted: boolean;
}

export interface MenuBoardProps {
  menus: MenuType[];
}

export interface PreMealPickProps {
  date: string;
}
