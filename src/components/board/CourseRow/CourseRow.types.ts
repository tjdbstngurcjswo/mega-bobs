import {MenuType} from '@/types/menu';
import {VoteResult, VoteType} from '@/types/vote';

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
