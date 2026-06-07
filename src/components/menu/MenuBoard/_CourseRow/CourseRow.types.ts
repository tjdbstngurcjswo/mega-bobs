import {MenuType} from '@/models/menu';
import {VoteResult, VoteType} from '@/models/vote';

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
